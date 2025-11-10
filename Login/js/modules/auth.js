// js/modules/auth.js
import {SUPABASE_URL, API_KEY} from './config.js'

// Login do usuário
export async function login(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
            'apikey': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    })
    const data = await res.json()
    if(res.ok) {
        localStorage.setItem('sb_token', data.access_token)
        localStorage.setItem('sb_refresh_token', data.refresh_token)
        return {success: true, data}
    } else {
        throw new Error(data.error_description || data.msg || "Erro no login")
    }
}

// Registro de novo usuário
export async function signup(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
            'apikey': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email, 
            password,
            options: {
                email_redirect_to: window.location.origin + '/dashboard.html'
            }
        })
    })
    const data = await res.json()
    if(res.ok) {
        return {success: true, data, needsVerification: !data.access_token}
    } else {
        throw new Error(data.error_description || data.msg || "Erro no cadastro")
    }
}

// Recuperação de senha
export async function recuperarSenha(email) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
        method: 'POST',
        headers: {
            'apikey': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            options: {
                redirect_to: window.location.origin + '/index.html'
            }
        })
    })
    const data = await res.json()
    if(res.ok) {
        return {success: true}
    } else {
        throw new Error(data.error_description || data.msg || "Erro ao recuperar senha")
    }
}

// Atualizar senha (após recuperação)
export async function atualizarSenha(novaSenha) {
    const token = localStorage.getItem('sb_token')
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        method: 'PUT',
        headers: {
            'apikey': API_KEY,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password: novaSenha
        })
    })
    const data = await res.json()
    if(res.ok) {
        return {success: true}
    } else {
        throw new Error(data.error_description || "Erro ao atualizar senha")
    }
}

// Verificar autenticação
export async function verificaAutenticacao() {
    const token = localStorage.getItem('sb_token')
    if(!token) {
        window.location.href = 'index.html'
        return false
    }
    
    // Verificar se o token é válido
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
            'apikey': API_KEY,
            'Authorization': `Bearer ${token}`
        }
    })
    
    if(!res.ok) {
        localStorage.removeItem('sb_token')
        localStorage.removeItem('sb_refresh_token')
        window.location.href = 'index.html'
        return false
    }
    
    return true
}

// Logout
export function logout() {
    localStorage.removeItem('sb_token')
    localStorage.removeItem('sb_refresh_token')
    window.location.href = 'index.html'
}