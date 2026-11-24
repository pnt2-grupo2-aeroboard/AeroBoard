import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import useAuthStore from '../src/stores/authStore.js'

describe('authStore', () => {
  // antes de cada test, una Pinia nueva y vacía
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('arranca sin usuario logueado', () => {
    const auth = useAuthStore()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.isAdmin).toBe(false)
  })

  it('setUser guarda el usuario y marca admin si el rol es admin', () => {
    const auth = useAuthStore()
    auth.setUser({ email: 'admin@aeroboard.com' }, 'token-1', 'admin', 'refresh-1')

    expect(auth.isAuthenticated).toBe(true)
    expect(auth.isAdmin).toBe(true)
    expect(auth.userEmail).toBe('admin@aeroboard.com')
    expect(auth.token).toBe('token-1')
  })

  it('un usuario con rol user no es admin', () => {
    const auth = useAuthStore()
    auth.setUser({ email: 'pasajero@aeroboard.com' }, 'token-2', 'user', 'refresh-2')

    expect(auth.isAuthenticated).toBe(true)
    expect(auth.isAdmin).toBe(false)
  })

  it('clearUser borra toda la sesión', () => {
    const auth = useAuthStore()
    auth.setUser({ email: 'admin@aeroboard.com' }, 'token-1', 'admin', 'refresh-1')
    auth.clearUser()

    expect(auth.isAuthenticated).toBe(false)
    expect(auth.isAdmin).toBe(false)
    expect(auth.token).toBe(null)
  })
})