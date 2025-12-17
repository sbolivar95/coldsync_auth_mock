// AppRouter.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { RequireAuth } from '@/router/RequireAuth'
import { RequireOrg } from '@/router/RequireOrg'

import { LoginPage } from '@/views/LoginPage'
import { RegisterPage } from '@/views/RegisterPage'
import { OnboardingPage } from '@/views/OnboardingPage'
import { CreateOrgPage } from '@/views/CreateOrgPage'
import { JoinOrgPage } from '@/views/JoinOrgPage'
import { AppHome } from '@/views/AppHome'
import { ForgotPasswordPage } from '@/views/ForgotPasswordPage'
import { ResetPasswordPage } from '@/views/ResetPasswordPage'

export function AppRouter() {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <Navigate
            to='/app'
            replace
          />
        }
      />

      <Route
        path='/login'
        element={<LoginPage />}
      />
      <Route
        path='/register'
        element={<RegisterPage />}
      />
      <Route
        path='/forgot-password'
        element={<ForgotPasswordPage />}
      />
      <Route
        path='/reset-password'
        element={<ResetPasswordPage />}
      />

      <Route element={<RequireAuth />}>
        <Route
          path='/onboarding'
          element={<OnboardingPage />}
        />
        <Route
          path='/onboarding/create'
          element={<CreateOrgPage />}
        />
        <Route
          path='/onboarding/join'
          element={<JoinOrgPage />}
        />

        <Route element={<RequireOrg />}>
          <Route
            path='/app'
            element={<AppHome />}
          />
        </Route>
      </Route>

      <Route
        path='*'
        element={
          <Navigate
            to='/app'
            replace
          />
        }
      />
    </Routes>
  )
}
