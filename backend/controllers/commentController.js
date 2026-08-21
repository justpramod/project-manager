const Comment = require("../models/Comment");

const createComment = async(req, res)=>{
try{
    const {text} = req.body;
    if(!text) return res.status(400).json({message: 'text filed required to comment'});

    const comment = await Comment.create({text, author: req.user._id, task: req.task._id});
    res.status(201).json({comment});
}
catch(e){
    console.log(e);
    res.status(500).json({message: 'Server error on createComment'});
}
};

const getComments = async(req, res)=>{
    try{
           
            const comments = await Comment.find({ task: req.task._id });
            if(comments.length===0) return res.status(200).json({message: 'No comments yet'});
            res.status(200).json({comments});
    }
    catch(e){
        console.log(e);
        res.status(500).json({message: 'Server error on getComment'});
    }
}

const deleteComment = async(req, res)=>{
try{
    const comment = await Comment.findById(req.params.id);
    if(!comment) return res.status(404).json({message: 'Comment doesnot exists'});

    if(comment.author.toString()!== req.user.toString()) return res.status(403).json({message: 'Not your comment!'});

    comment.deleteOne(req.params.id);
    res.status(200).json({message: 'Comment Deleted Successfully'});
}
catch(e){
    console.log(e);
    res.status(500).json({message: 'Server error on deleteComment'});
}
};

module.exports = {createComment, getComments, deleteComment};