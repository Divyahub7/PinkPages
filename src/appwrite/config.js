import conf from "../conf/conf.js";
import { Client, ID, Databases, Query, Storage } from "appwrite";

export class Service {
  client = new Client();
  database;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.database = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({
    title,
    slug,
    content,
    featuredImage,
    status,
    userId,
    userName,
  }) {
    try {
      return await this.database.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteTableId,
        slug || ID.unique(), // documentId (row id)
        {
          title,
          content,
          featuredImage,
          status,
          userId,
          userName: userName || "PinkPages Author",
        },
      );
    } catch (error) {
      console.log("Appwrite service :: createPost :: error", error);
      throw error;
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.database.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteTableId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        },
      );
    } catch (error) {
      console.log("Appwrite service :: updatePost :: error", error);
      throw error;
    }
  }

  async deletePost(slug) {
    try {
      await this.database.deleteDocument(
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
      return await this.database.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteTableId,
        slug,
      );
    } catch (error) {
      console.log("Appwrite service :: getPost :: error", error);
      throw error;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.database.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteTableId,
        queries,
      );
    } catch (error) {
      console.log("Appwrite service :: getPosts :: error", error);
      return false;
    }
  }

  async getPostsByUser(userId) {
    try {
      return await this.database.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteTableId,
        [Query.equal("userId", userId), Query.equal("status", "active")],
      );
    } catch (error) {
      console.log("getPostsByUser error", error);
      return null;
    }
  }

  // File services
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

  getFilePreview(fileId) {
    return this.bucket.getFileView(conf.appwriteBucketId, fileId);
  }

  async getProfile(userId) {
    try {
      const res = await this.database.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteProfileCollectionId,
        [Query.equal("userId", userId)],
      );
      return res.documents[0] || null;
    } catch (error) {
      console.log("getProfile error", error);
      return null;
    }
  }

  async createProfile({ userId, bio }) {
    try {
      return await this.database.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteProfileCollectionId,
        ID.unique(),
        { userId, bio: bio || "" },
      );
    } catch (error) {
      console.log("createProfile error", error);
      return null;
    }
  }

  async updateProfile(documentId, { bio }) {
    try {
      return await this.database.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteProfileCollectionId,
        documentId,
        { bio },
      );
    } catch (error) {
      console.log("updateProfile error", error);
      return null;
    }
  }

  // Reaction services
  async getReactions(postId) {
    try {
      return await this.database.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteReactionsCollectionId,
        [Query.equal("postId", postId)],
      );
    } catch (error) {
      console.log("getReactions error", error);
      return null;
    }
  }

  async getUserReaction(postId, userId) {
    try {
      const res = await this.database.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteReactionsCollectionId,
        [Query.equal("postId", postId), Query.equal("userId", userId)],
      );
      return res.documents[0] || null;
    } catch (error) {
      console.log("getUserReaction error", error);
      return null;
    }
  }

  async addReaction({ postId, userId, reaction }) {
    try {
      return await this.database.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteReactionsCollectionId,
        ID.unique(),
        { postId, userId, reaction },
      );
    } catch (error) {
      console.log("addReaction error", error);
      return null;
    }
  }

  async updateReaction(documentId, reaction) {
    try {
      return await this.database.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteReactionsCollectionId,
        documentId,
        { reaction },
      );
    } catch (error) {
      console.log("updateReaction error", error);
      return null;
    }
  }

  async deleteReaction(documentId) {
    try {
      await this.database.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteReactionsCollectionId,
        documentId,
      );
      return true;
    } catch (error) {
      console.log("deleteReaction error", error);
      return false;
    }
  }

  // Comment services
  async getComments(postId) {
    try {
      return await this.database.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCommentsCollectionId,
        [Query.equal("postId", postId), Query.orderDesc("$createdAt")],
      );
    } catch (error) {
      console.log("getComments error", error);
      return null;
    }
  }

  async addComment({ postId, userId, userName, content, parentId = "" }) {
    try {
      return await this.database.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCommentsCollectionId,
        ID.unique(),
        { postId, userId, userName, content, parentId },
      );
    } catch (error) {
      console.log("addComment error", error);
      return null;
    }
  }

  async deleteComment(documentId) {
    try {
      await this.database.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCommentsCollectionId,
        documentId,
      );
      return true;
    } catch (error) {
      console.log("deleteComment error", error);
      return false;
    }
  }
}

const service = new Service();
export default service;
