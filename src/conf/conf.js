const conf = {
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteTableId: String(import.meta.env.VITE_APPWRITE_TABLE_ID),
  appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
  tinymceapikey: String(import.meta.env.VITE_TINYMCE_API_KEY),
  appwriteProfileCollectionId: String(
    import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID,
  ),
  appwriteReactionsCollectionId: String(
    import.meta.env.VITE_APPWRITE_REACTIONS_COLLECTION_ID,
  ),
  appwriteCommentsCollectionId: String(
    import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID,
  ),
};

export default conf;
