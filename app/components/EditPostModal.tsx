import { PostRequestDto } from "@/api/postsApi";
import React from "react";
import { Modal, View, TextInput, Button, Text } from "react-native";

interface EditPostModalProps {
    open: boolean;
    onClose: () => void;
    formData: PostRequestDto; // Cambié el tipo a PostRequestDto
    setFormData: React.Dispatch<React.SetStateAction<PostRequestDto>>; // Cambié el tipo de setFormData
    handleSave: () => void;
    image: File | null;
    setImage: React.Dispatch<React.SetStateAction<File | null>>;
    isEditing: boolean;
}


const EditPostModal: React.FC<EditPostModalProps> = ({
    open,
    onClose,
    formData,
    setFormData,
    handleSave,
    image,
    setImage,
    isEditing,
}) => {
    return (
        <Modal visible={open} animationType="slide">
            <View style={{ padding: 16 }}>
                <Text>{isEditing ? "Editar Publicación" : "Nueva Publicación"}</Text>

                <TextInput
                    value={formData.title}
                    onChangeText={(text) => setFormData({ ...formData, title: text })}
                    placeholder="Título"
                    style={{ borderWidth: 1, padding: 10, marginVertical: 8 }}
                />

                <TextInput
                    value={formData.content}
                    onChangeText={(text) => setFormData({ ...formData, content: text })}
                    placeholder="Contenido"
                    style={{ borderWidth: 1, padding: 10, marginVertical: 8 }}
                />

                <Button title="Guardar" onPress={handleSave} />
                <Button title="Cerrar" onPress={onClose} />
            </View>
        </Modal>
    );
};

export default EditPostModal;
