// js/modules/auth.js
import {SUPABASE_URL, API_KEY} from './config.js'

// Login do usuário
export async function login(email, password) {
    console.log('Tentando login para:', email)
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
            'apikey': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    })
    const data = await response.json()
    console.log('Resposta do supabase:', data)

    if(!response.ok) {
        const errorMsg = data.error_description || data.msg || "Erro no login"
        console.error('Erro no login:', errorMsg)
        throw new Error(errorMsg)
    }

        localStorage.setItem('sb_token', data.access_token)
        localStorage.setItem('sb_refresh_token', data.refresh_token)
        localStorage.setItem('sb_user', JSON.stringify(data.user))

        console.log('Login bem-sucedido para:', data.user.email)
        return data
    }

// Registro de novo usuário
export async function signup(email, password) {
    console.log('Criando conta para:', email)
    
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
            'apikey': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( {email, password })
    })
    const data = await res.json()
    console.log('Resposta do singup:', data)

    if(!response.ok) {
        const errorMsg = data.error_description || data.msg || "Erro no cadastro"
        console.error('Erro no singup:', errorMsg)
        throw new Error(errorMsg)
    }

    if(data.access_token) {
        localStorage.setItem('sb_token', data.access_token)
        localStorage.setItem('sb_refresh_token', data.refresh_token)
        localStorage.setItem('sb_user', JSON.stringify(data.user))
    }

    return {
        success: true,
        needsVerification: !data.access_token,  
        data
    }

}

export async function getCurrentUser() {
    const token = localStorage.getItem('sb_token')
    
    if(!token) {
        console.log('Nenhum token encontrado')
        return null
    }

    try {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            headers: {
                'apikey': API_KEY,
                'Authorization': `Bearer ${token}`
            }
        })
            if (!response.ok) {
                console.log('Token inválido')
                localStorage.removeItem('sb_token')
                localStorage.removeItem('sb_refresh_token')
                localStorage.removeItem('sb_user')
                return null
            }

        const user = await response.json()
        console.log('Usuário atual :', user)
        return user
    } catch (error) {
        console.error('Erro ao buscar usuário:', error)
        return null
    }
}

export function logout() {
    localStorage.removeItem('sb_token')
    localStorage.removeItem('sb_refresh_token')
    localStorage.removeItem('sb_user')
    window.location.href = 'login.html'
}

export async function requireAuth() {
    const user = await getCurrentUser()
    if(!user) {
        window.location.href = 'login.html'
       return false
    }
    return user
}