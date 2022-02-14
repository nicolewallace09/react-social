const Post = require('../../models/Post'); 
const auth = require('../../utils/auth'); 
const { UserInputError, AuthenticationError } = require('apollo-server'); 

module.exports = {
    Mutation: {
        async createComment(parent, { postId, body }, context) {
            const { username } = auth(context); 
            if(body.trim() === '') {
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Comment body must not be empty'
                    }
                })
            }
            const post = await Post.findById(postId); 
            if(post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save(); 
                return post; 
            } else {
                throw new UserInputError('Post not found');
            }
        }, 
        async deleteComment(parent, { postId, commentId}, context) {
            const { username } = auth(context);
            const post = await Post.findById(postId); 
            if(post) {
                const index = post.comments.findIndex(i => i.id === commentId);
                if(post.comments[index].username === username) {
                    post.comments.splice(index, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } else {
                throw new UserInputError('Post not found');
            }
        }
    }
}