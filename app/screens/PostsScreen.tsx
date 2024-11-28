import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../AuthContext";
import { getAllPosts, createPost, deletePost, updatePost, Post, PostRequestDto } from "@/api/postsApi";
import PostsList from "../components/PostsList";
import CommentsModal from "../components/CommentsModal";
import EditPostModal from "../components/EditPostModal";
import { toast } from "sonner";
import { User } from "@/api/registerAndLoginApi";

const PostsScreen = () => {
    //const { token, user } = useAuth();
    const user: User = {
        userId: "34",
        email: "",
        name: "",
        profilePicture: "daasd",
        bio: "",
        userType: "",
        createdAt: "",
        updatedAt: ""
    }

    const token = "asdasd"

    const [posts, setPosts] = useState<Post[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isCommentModalOpen, setCommentModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [selectedPostComments, setSelectedPostComments] = useState<number | null>(null);
    const [formData, setFormData] = useState<PostRequestDto>({
        title: "",
        content: "",
        userId: user?.userId?.toString() || "0",
        status: "ACTIVE",
    });
    const [image, setImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchPosts = async () => {
            if (!token) return;
            setIsLoading(true);
            try {
                const fetchedPosts = await getAllPosts(token);
                setPosts(fetchedPosts);
            } catch (error) {
                console.error("Error fetching posts:", error);
                toast.error("Error al cargar las publicaciones");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, [token]);

    const handleCreateOrEditPost = async () => {
        setIsLoading(true);
        if (!user || !token) return;

        try {
            const savedPost = selectedPost
                ? await updatePost(selectedPost.postId, formData, image, token)
                : await createPost(formData, image, token);

            if (savedPost) {
                setPosts((prevPosts) =>
                    selectedPost
                        ? prevPosts.map((post) => (post.postId === savedPost.postId ? savedPost : post))
                        : [savedPost, ...prevPosts]
                );

                toast.success("Post actualizado correctamente");
                setEditModalOpen(false);
                setSelectedPost(null);
                setFormData({
                    title: "",
                    content: "",
                    userId: String(user.userId),
                    status: "ACTIVE",
                });
                setImage(null);
            }
        } catch (error) {
            console.error("Error handling post:", error);
            toast.error("No se pudo actualizar el post");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeletePost = async (postId: number) => {
        setIsLoading(true);
        try {
            await deletePost(postId, token!);
            setPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId));
            toast.success("Post eliminado correctamente");
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Error al eliminar la publicación");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchComments = async (postId: number) => {
        setIsLoading(true);
        try {
            // Simulamos la llamada para obtener los comentarios
            // const fetchedComments = await getCommentsByPostId(postId, token!);
            // setComments(fetchedComments);
            setSelectedPostComments(postId);
            setCommentModalOpen(true);
        } catch (error) {
            console.error("Error fetching comments:", error);
            toast.error("Error al cargar los comentarios");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Button title="Regresar" onPress={() => navigation.goBack()} />

            <View style={{ marginVertical: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>Publicaciones</Text>
                <Button title="Nueva Publicación" onPress={() => setEditModalOpen(true)} />
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.postId.toString()}
                    renderItem={({ item }) => (
                        <PostsList
                            post={item}
                            onEdit={() => {
                                setSelectedPost(item);
                                setFormData({
                                    title: item.title,
                                    content: item.content,
                                    userId: item.userId.toString(),
                                    status: item.status,
                                });
                                setEditModalOpen(true);
                            }}
                            onDelete={() => handleDeletePost(item.postId)}
                            onViewComments={() => fetchComments(item.postId)}
                        />
                    )}
                />
            )}

            <CommentsModal
                open={isCommentModalOpen}
                onClose={() => setCommentModalOpen(false)}
                postId={selectedPostComments}
                comments={[]} // Replace with actual comments state
                newCommentContent=""
                setNewCommentContent={() => { }} // Replace with actual state setter
                handleAddComment={() => { }} // Replace with actual handler function
            />

            <EditPostModal
                open={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                formData={formData}
                setFormData={setFormData}
                handleSave={handleCreateOrEditPost}
                image={image}
                setImage={setImage}
                isEditing={!!selectedPost}
            />
        </View>
    );
};

export default PostsScreen;
