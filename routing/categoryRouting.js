const router = require('express').Router();
const mongoose = require("mongoose");
const session = require('express-session');
const cookieParser = require('cookie-parser');


const Session = require('../models/Session');
const Category = require('../models/Category');


router.use(session({ secret: "sdfga465regse", resave: false, saveUninitialized: true }));
router.use(cookieParser());


router.get('/getrootcategories', (req, res) => {
  Category.find({ parentcategory: null }, function (err, categories) {
    res.send(categories);
  });
});

router.post('/getsubcategories', (req, res) => {

  Category.findById({ _id: req.body.id }, function (err, categories) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    if (!categories) {
      return res.status(404).send();
    }
    return res.send(categories);
  });
});

router.post('/addrootcategory', (req, res) => {

  var newCategory = new Category({
    categoryname: req.body.categoryname
  });

  newCategory.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    return res.json({ success: true, categories: newCategory });
  })

});

router.post('/addsubcategory', (req, res) => {

  var newCategory = new Category({
    categoryname: req.body.categoryname,
    parentcategory: req.body.parentcategory
  });

  Category.findOne({ categoryname: req.body.parentcategory }, function (err, category) {
    category.childcategories.push({ _id: newCategory._id, categoryname: req.body.categoryname });
    category.save();
  });

  newCategory.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    return res.json({ success: true });
  })

});

router.post('/updatecategory', (req, res, next) => {
  let newcategoryname = req.body.category.newcategoryname;
  let oldcategoryname = req.body.category.oldcategoryname;

  Category.findByIdAndUpdate({ _id: req.body.id }, { categoryname: newcategoryname },
    function (err, category) {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
      if (!category) {
        return res.status(404).send();
      }

      if (category.parentcategory) {
        updateUpCategories(category, newcategoryname, oldcategoryname, next);
      }
      if (category.childcategories.length) {
        updateBelowCategories(oldcategoryname, newcategoryname, next);
      }
      return res.json({ success: true });

    })
});

function updateUpCategories(category, newcategoryname, oldcategoryname, next) {
  Category.findOne({ categoryname: category.parentcategory }, function (err, parentCategory) {
    if (err) {
      console.log(err);
      return next(err);
    }
    let newObj = parentCategory.childcategories.find(ct => ct.categoryname === oldcategoryname);
    newObj.categoryname = newcategoryname;
    parentCategory.save();
    return next();
  })
}

function updateBelowCategories(oldcategoryname, newcategoryname, next) {
  Category.find({ parentcategory: oldcategoryname }, function (err, categories) {
    var connectedCategoryIds = [];
    categories.forEach(function (item) {
      connectedCategoryIds.push(item._id);
    });

    Category.update({ '_id': { '$in': connectedCategoryIds } }, { parentcategory: newcategoryname },
      { multi: true },
      function (err, lastCategories) {
        if (err) {
          console.log(err);
          return next(err);
        }
        else {
          return next();
        }
      });
  });
}


router.post('/deletecategory', (req, res, next) => {
  Category.findByIdAndRemove({ _id: req.body.id }, function (err, category) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    if (!category) {
      return res.status(404).send();
    }
    if (category.childcategories.length) {
      Category.find({ parentcategory: req.body.categoryname }, function (err, categories) {
        deleteBelowCategories(categories, next);
      });
    }
    if (category.parentcategory) {
      deleteUpCategories(category, next);
    }
    return res.json({ success: true });

  })
});

function deleteUpCategories(category, next) {
  Category.findOne({ categoryname: category.parentcategory }, function (err, parentCategory) {
    if (err) {
      console.log(err);
      return next(err);
    }
    let objIndex = parentCategory.childcategories.findIndex(ct => ct.categoryname === category.categoryname);
    parentCategory.childcategories.splice(objIndex, 1);
    console.log(parentCategory.childcategories)
    parentCategory.save();
    return next();
  })
}

function deleteBelowCategories(categories, next) {
  var connectedCategoryIds = [];
  var connectedSubCategoryIds = [];
  categories.forEach(function (item) {
    connectedCategoryIds.push(item._id);
    if (item.childcategories && item.childcategories != []) {
      for (var index = 0; index < item.childcategories.length; index++) {
        connectedSubCategoryIds.push(item.childcategories[index]);
      }
    }
  });

  Category.remove({ '_id': { '$in': connectedCategoryIds } }, function (err, lastCategories) {
    if (err) {
      console.log(err);
      return next(err);
    }

    if (connectedSubCategoryIds.length) {
      deleteBelowCategories(connectedSubCategoryIds, next);
    } else {
      return next();
    }
  });
}


module.exports = router;