import { BASE_URL } from "../app/Api";
import axios from "axios";

export interface CommentRequestDto {
    userId: number;
    postId: number;
    content: string;
}

export interface CommentResponseDto {
    commentId: number;
    userId: number;
    postId: number;
    content: string;
    commentDate: string;
    userName: string;
    userPhoto: string;
}


export const getCommentsByPostId = async (
    postId: number,
    token: string
): Promise<CommentResponseDto[]> => {
    const response = await axios.get<CommentResponseDto[]>(`${BASE_URL}/comments/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const createComment = async (
    commentRequestDto: CommentRequestDto,
    token: string
): Promise<CommentResponseDto> => {
    const response = await axios.post<CommentResponseDto>(`${BASE_URL}/comments`, commentRequestDto, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};


export const updateComment = async (
    commentId: number,
    commentRequestDto: CommentRequestDto,
    token: string
): Promise<CommentResponseDto> => {
    const response = await axios.put<CommentResponseDto>(
        `${BASE_URL}/comments/${commentId}`,
        commentRequestDto,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const deleteComment = async (commentId: number, token: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/comments/${commentId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};