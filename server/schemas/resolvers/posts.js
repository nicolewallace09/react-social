const Post = require('../../models/Post');
const auth = require('../../utils/auth'); 
const { AuthenticationError } = require('apollo-server'); 

module.exports = {
    Query: {
        async getPosts() {
            try { 
                const posts = await Post.find(); 
                return posts; 
            } catch (err) {
                throw new Error(err); 
            }
        },
        async getPost(parent, { postId }) {
            try {
                const post = await Post.findById(postId);
                if(post) {
                    return post;  
                } else {
                    throw new Error('Post not found')
                }
            } catch(err) {
                throw new Error(err); 
            }
        }
    },
    Mutation: {
        async createPost(parent, { body }, context){
            const user = auth(context);
            const newPost = new Post({
                body,
                user: user.id, 
                username: user.username, 
                createdAt: new Date().toISOString()
            });
            const post = await newPost.save();
            return post; 
        },
        async deletePost(parent, { postId }, context) {
            const user = auth(context); 
            try {
                const post = await Post.findById(postId); 
                if(user.username === post.username) {
                    await post.delete(); 
                    return 'Post deleted successfully';
                } else {
                    throw new AuthenticationError('Not allowed');
                }
            } catch(err) {
                throw new Error(err); 
            }
        }
    }
};