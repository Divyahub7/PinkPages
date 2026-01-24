import conf from "../conf.js";
import { Client, ID, TableDB, Query, Storage } from "appwrite";

export class Service {
  client = new Client();
  tablesDB;
  bucket;
  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.tablesDB = new TableDB(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImg, status, userId }) {
    try {
      return await this.tablesDB.createRow(
        conf.appwriteDatabaseId,
        conf.appwriteTableId,
        slug,
        {
          title,
          content,
          featuredImg,
          status,
          userId,
        },
      );
    } catch (error) {
      console.log("Appwrite service :: createPost :: error", error);
    }
  }

  async updatePost(slug, { title, content, featuredImg, status }) {
    try {
      return await this.tablesDB.updateRow(
        conf.appwriteDatabaseId,
        conf.appwriteTableId,
        slug,
        {
          title,
          content,
          featuredImg,
          status,
        },
      );
    } catch (error) {
      console.log("Appwrite service :: updatePost :: error", error);
    }
  }

  async deletePost(slug) {
    try {
      await this.tablesDB.deleteRow(
        conf.appwriteDatabaseId,
        conf.appwriteTableId,
        slug,
      );
      return true;
    } catch (error) {
      console.log("Appwrite service :: deletePost :: error", error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      return await this.tablesDB.getRow(
        conf.appwriteDatabaseId,
        conf.appwriteTableId,
        slug,
      );
    } catch (error) {
      console.log("Appwrite service :: getPost :: error", error);
    }
  }

  // QUERIES
  async getPosts(queries = [Query.equal("status", "active")]) {
    // only get the post with active status - Use QUERIES( REFER TO APPWRITE DOCS)
    try {
      return await this.tablesDB.listRows(
        conf.appwriteDatabaseId,
        conf.appwriteTableId,
        queries,
      );
    } catch (error) {
      console.log("Appwrite service :: getAllPosts :: error", error);
      return false;
    }
  }

  // File upload services
  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file,
      );
    } catch (error) {
      console.log("Appwrite service :: uploadFile :: error", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("Appwrite service :: deleteFile :: error", error);
      return false;
    }
  }

  // not async as it is very fast so no need
  getFilePreview(fileId) {
    return this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
  }
}

const service = new Service();
export default service;
