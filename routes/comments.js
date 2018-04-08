var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

router.get('/new', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, data) => {
        if (err) {
            console.log('error');
        } else {
            res.render('comments/new', { campground: data });
        }
    });
});

router.post('/', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log('err');
            redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash('error', ('Something Wrong, Try Again Later '));
                    console.log('err');
                } else {
                    comment.author.id= req.user._id;
                    comment.author.username = req.user.username;

                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', ('successfully added comment '));
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});


//Edit comment
router.get('/:comment_id/edit', middleware.checkCommentOwnership,(req, res)=>{
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if(err){
            res.redirect('back');
        }
        else{
             res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
        }
    });
   
});

//Update Comment
router.put('/:comment_id', middleware.checkCommentOwnership,(req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment)=>{
        if(err){
            res.redirect('back');
        }
        else{
             res.redirect('/campgrounds/'+ req.params.id);
        }
    });
   
});

//Destroy Comment
router.delete('/:comment_id', middleware.checkCommentOwnership,(req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, data) => {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            req.flash('success', ('Comment Delete'));
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});


module.exports = router;