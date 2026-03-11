import conf from "../conf/conf.js";
import { Client, TablesDB, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  databases; //table
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new TablesDB(this.client);
    this.bucket = new Storage(this.client);
  }

  // Post Methods

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.databases.createRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionId,
        rowId: slug,
        data: {
          title,
          slug,
          content,
          featuredImage,
          status,
          userId
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async updatePost(slug, { title, content, featuredImage, status} ){
    try {
        return await this.databases.updateRow(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            slug,
            {
                title, content, featuredImage, status
            }
    )
    } 
    catch (error) {
         console.log("Appwrite service :: updatePost :: error", error);
         throw error;
    }
  }

  async deletePost(slug){
    try{
        await this.databases.deleteRow({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteCollectionId,
            rowId: slug
        });
        return true;
    }
    catch(error){
        console.log("delete prob", error)
        return false;
    }
  }

  async getPost(slug){
    try {
       return await this.databases.getRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionId,
        rowId: slug
      });
    } catch (error) {
        console.log("getPost error", error);
        
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]){
    try {
        return await this.databases.listRows({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteCollectionId,
            queries
        });
    } catch (error) {
        console.log("getPosts error", error);
        return false;
    }
  }

  //File Methods (Store files like images, videos, documents)

  async uploadFile(file){
    try {
      return await  this.bucket.createFile({
          bucketId: conf.appwriteBucketId,
          fileId: ID.unique(),
          file: file
      }
      )
      
    } catch (error) {
      console.log("upload file error", error);
    }
  }

  async deleteFile(fileId){
    try {
      await this.bucket.deleteFile({
        bucketId: conf.appwriteBucketId,
        fileId: fileId
      })
      return true;
    } catch (error) {
      console.log("Deletefile error", err);
      return false
    }
  }

  getFilePreview(fileId){
    return this.bucket.getFilePreview({
        bucketId: conf.appwriteBucketId,
        fileId: fileId,
    })
  }


}

const service = new Service();
export default service;