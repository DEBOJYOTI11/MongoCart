/*
  Copyright (c) 2008 - 2016 MongoDB, Inc. <http://mongodb.com>

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/


var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


function ItemDAO(database) {
    "use strict";

    this.db = database;

this.getCategories = function(callback) {
        "use strict";
        this.db.collection('item').aggregate([
                    {$group:{
                       _id:"$category",
                        num:{$sum:1} }}
            ]).toArray(function(err, relatedItems) {
                //assert.equal(null, err);
                let categories = relatedItems;
                console.log(categories);
                callback(categories);
            })
    }


this.getItems = function(category, page, itemsPerPage, callback) {
        "use strict";
         if(category!="All"){

            this.db.collection('item').find({"category":category}).
                                    sort({"_id":1}).skip(page*5).
                                    limit(itemsPerPage).
                                    toArray(function(e,r){
                                      
                                        //assert(null,e);
                                        callback(r);
                                    });
         }
            

                                        
        else
            this.db.collection('item').
                                    find().
                                    sort({"title":1}).
                                    skip(page*5).
                                    limit(itemsPerPage).
                                    toArray(function(e,r){
                                        //assert(null,e);
                                        //console.log(r)
                                        callback(r);
                                     })
}


 this.getNumItems = function(category, callback) {
        "use strict";

        var numItems = 0;

        if(category!="All")
        this.db.collection("item").count({"category":category},function(err,n){
            //assert(err,null);
    
            callback(n);
        })
    else
        this.db.collection("item").count({},function(err,n){
            //assert(err,null);
        
            callback(n);
        })
        //callback(numItems);
    }


this.searchItems = function(query, page, itemsPerPage, callback) {
        "use strict";

        var foundItemsArray = [];
        var cursor = this.db.collection('item').find({$text:{$search: query}})
            .skip(page*itemsPerPage).limit(itemsPerPage);
        cursor.forEach(
            function(doc) {
                foundItemsArray.push(doc);
            },
            function(err) {
               // assert.equal(err, null);
            }
        );
        callback(foundItemsArray);
        
    }


this.getNumSearchItems = function(query, callback) {
        "use strict";

        var numItems = 0;

        /*
        * TODO-lab2B
        *
        * LAB #2B: Using the value of the query parameter passed to this
        * method, count the number of items in the "item" collection matching
        * a text search. Pass the count to the callback function.
        *
        * getNumSearchItems() depends on the same text index as searchItems().
        * Before implementing this method, ensure that you've already created
        * a SINGLE text index on title, slogan, and description. You should
        * simply do this in the mongo shell.
        */

        callback(numItems);
}


this.getItem = function(itemId, callback) {
        "use strict";

    this.db.collection("item").find({_id:itemId})
                .toArray(function(e,r){
                        console.log(r[0]);
                        callback(r[0]);
        
                })

}


this.getRelatedItems = function(callback) {
        "use strict";

        this.db.collection("item").find({})
            .limit(4)
            .toArray(function(err, relatedItems) {
                assert.equal(null, err);
                callback(relatedItems);
            });
    };


this.addReview = function(itemId, comment, name, stars, callback) {
    "use strict";

    var reviewDoc = {
        name: name,
        comment: comment,
        stars: stars,
        date: Date.now()
    }

    this.db.collection("item").updateOne(
        {_id: itemId},
        {"$push": {reviews: reviewDoc}},
        function(err, doc) {
            assert.equal(null, err);
            callback(doc);
        });
}


    this.createDummyItem = function() {
        "use strict";

        var item = {
            _id: 1,
            title: "Gray Hooded Sweatshirt",
            description: "The top hooded sweatshirt we offer",
            slogan: "Made of 100% cotton",
            stars: 0,
            category: "Apparel",
            img_url: "/img/products/hoodie.jpg",
            price: 29.99,
            reviews: []
        };

        return item;
    }
}


module.exports.ItemDAO = ItemDAO;
