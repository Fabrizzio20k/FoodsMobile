import React from "react";
import { Modal, View, Text, TextInput, Button, FlatList, Image, StyleSheet } from "react-native";
import { CommentResponseDto } from "@/api/commentsApi"; // Asumo que tienes este DTO en tu API
import { useAuth } from "../AuthContext";

interface CommentsModalProps {
    open: boolean;
    onClose: () => void;
    postId: number | null; // Añadido
    comments: CommentResponseDto[];
    newCommentContent: string;
    setNewCommentContent: (value: string) => void;
    handleAddComment: () => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
    open,
    onClose,
    postId,  // Aquí se recibe postId
    comments,
    newCommentContent,
    setNewCommentContent,
    handleAddComment,
}) => {
    const { user } = useAuth();

    return (
        <Modal visible={open} animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Comentarios</Text>
                </View>

                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.commentId.toString()}
                    renderItem={({ item: comment }) => (
                        <View style={styles.commentContainer}>
                            {/* Imagen de perfil */}
                            <View style={styles.profileImageContainer}>
                                <Image
                                    source={{ uri: comment.userPhoto || "placeholder.jpg" }}
                                    style={styles.profileImage}
                                />
                            </View>
                            {/* Detalles del comentario */}
                            <View style={styles.commentDetails}>
                                <View style={styles.commentHeader}>
                                    <Text style={styles.commentUserName}>@{comment.userName}</Text>
                                    <Text style={styles.commentDate}>
                                        {new Date(comment.commentDate).toLocaleDateString()}
                                    </Text>
                                </View>
                                <Text style={styles.commentText}>{comment.content}</Text>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.emptyMessage}>No hay comentarios.</Text>
                    }
                    style={styles.commentList}
                />

                {/* Formulario para agregar un nuevo comentario */}
                <View style={styles.commentInputContainer}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={{ uri: user?.profilePicture || "placeholder.jpg" }}
                            style={styles.profileImage}
                        />
                    </View>
                    <TextInput
                        value={newCommentContent}
                        onChangeText={setNewCommentContent}
                        placeholder="Escribe un comentario..."
                        style={styles.textInput}
                    />
                    <Button title="Publicar" onPress={handleAddComment} />
                </View>

                {/* Cerrar modal */}
                <Button title="Cerrar" onPress={onClose} />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "white",
        padding: 16,
    },
    header: {
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
    },
    commentList: {
        maxHeight: 300,
        marginBottom: 16,
    },
    commentContainer: {
        flexDirection: "row",
        marginBottom: 12,
        padding: 8,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
    },
    profileImageContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: "hidden",
        marginRight: 12,
    },
    profileImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    commentDetails: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    commentUserName: {
        fontWeight: "bold",
        color: "#333",
    },
    commentDate: {
        fontSize: 12,
        color: "#777",
    },
    commentText: {
        color: "#333",
        fontSize: 14,
    },
    emptyMessage: {
        textAlign: "center",
        color: "#777",
    },
    commentInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginRight: 12,
    },
});

export default CommentsModal;
