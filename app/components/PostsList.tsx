import React from "react";
import { View, Text, Button, Image } from "react-native";
import { Post } from "@/api/postsApi";
import { FaEdit, FaTrash, FaCommentDots } from "react-icons/fa"; // Usa íconos nativos si los necesitas

interface PostsListProps {
    post: Post;
    onEdit: () => void;
    onDelete: () => void;
    onViewComments: () => void; // Añadido
}

const PostsList: React.FC<PostsListProps> = ({ post, onEdit, onDelete, onViewComments }) => {
    return (
        <View style={{ marginBottom: 20, padding: 16, backgroundColor: "#fff", borderRadius: 8, shadowColor: "#000", shadowOpacity: 0.1 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text>{post.userName}</Text>
                <Text>{new Date(post.createdDate).toLocaleDateString()}</Text>
            </View>

            {post.image && (
                <Image
                    source={{ uri: post.image }}
                    style={{ width: "100%", height: 200, marginVertical: 10 }}
                />
            )}

            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{post.title}</Text>
            <Text>{post.content}</Text>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <Button title="Comentarios" onPress={onViewComments} /> {/* Aquí usamos onViewComments */}
                <View style={{ flexDirection: "row" }}>
                    <Button title="Editar" onPress={onEdit} />
                    <Button title="Eliminar" onPress={onDelete} />
                </View>
            </View>
        </View>
    );
};

export default PostsList;

