import { create } from 'zustand'
import {
    apiGetSessions,
    apiGetSession,
    apiCreateSession,
    apiDeleteSession,
    apiLoadMore,
    apiUpdateQna,
    apiLearnMore,
} from '../utils/api'

const useSessionStore = create((set, get) => ({
    sessions: [],
    currentSession: null,
    loading: false,
    creating: false,
    loadingMore: false,
    error: null,

    learnMorePanel: {
        open: false,
        title: '',
        content: '',
        loading: false,
        questionId: null,
    },

    fetchSessions: async () => {
        set({ loading: true, error: null })
        try {
            const data = await apiGetSessions()
            set({ sessions: data, loading: false })
        } catch (err) {
            set({ error: err.message, loading: false })
        }
    },

    createSession: async (form) => {
        set({ creating: true, error: null })
        try {
            const newSession = await apiCreateSession(form)
            set((state) => ({
                sessions: [newSession, ...state.sessions],
                creating: false,
            }))
            return newSession
        } catch (err) {
            set({ error: err.message, creating: false })
            return null
        }
    },

    deleteSession: async (id) => {
        try {
            await apiDeleteSession(id)
            set((state) => ({
                sessions: state.sessions.filter((s) => s._id !== id),
            }))
        } catch (err) {
            set({ error: err.message })
        }
    },

    fetchSession: async (id) => {
        set({ loading: true, error: null, currentSession: null })
        try {
            const data = await apiGetSession(id)
            set({ currentSession: data, loading: false })
        } catch (err) {
            set({ error: err.message, loading: false })
        }
    },

    loadMore: async () => {
        const session = get().currentSession
        if (!session) return
        set({ loadingMore: true })
        try {
            const updated = await apiLoadMore(session._id)
            set({ currentSession: updated, loadingMore: false })
        } catch (err) {
            set({ error: err.message, loadingMore: false })
        }
    },

    togglePin: async (qnaId) => {
        const session = get().currentSession
        if (!session) return
        const item = session.qna.find((q) => q._id === qnaId)
        if (!item) return
        set((state) => ({
            currentSession: {
                ...state.currentSession,
                qna: state.currentSession.qna.map((q) =>
                    q._id === qnaId ? { ...q, pinned: !q.pinned } : q
                ),
            },
        }))
        try {
            await apiUpdateQna(session._id, qnaId, { pinned: !item.pinned })
        } catch (err) {
            set((state) => ({
                currentSession: {
                    ...state.currentSession,
                    qna: state.currentSession.qna.map((q) =>
                        q._id === qnaId ? { ...q, pinned: item.pinned } : q
                    ),
                },
            }))
        }
    },

    openLearnMore: async (question, role, questionId) => {
        set({
            learnMorePanel: {
                open: true,
                title: question,
                content: '',
                loading: true,
                questionId,
            },
        })
        try {
            const data = await apiLearnMore(question, role)
            set({
                learnMorePanel: {
                    open: true,
                    title: question,
                    content: data.explanation,
                    loading: false,
                    questionId,
                },
            })
        } catch (err) {
            set({
                learnMorePanel: {
                    open: true,
                    title: question,
                    content: 'Failed to load explanation.',
                    loading: false,
                    questionId,
                },
            })
        }
    },

    closeLearnMore: () => {
        set({
            learnMorePanel: {
                open: false,
                title: '',
                content: '',
                loading: false,
                questionId: null,
            },
        })
    },
}))

export default useSessionStore