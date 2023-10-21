import { memo, useCallback, useState } from 'react'
import { useStore } from '@essar05/student-manager-core'
import { KeyboardAvoidingView } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'

import { PageContainer } from '../../components/PageContainer'
import { AppStackScreenProps } from '../../navigation/types'
import { useStyles } from '../../shared/hooks/useStyles'
import { setStorageItem } from '../../shared/storage'
import { styles } from './Login.styles'

export const Login = memo((_: AppStackScreenProps<'Login'>) => {
  const [hasLoginError, setLoginError] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = useStore(state => state.auth.actions.login)

  const handleLogin = useCallback(async () => {
    setLoginError(false)

    const token = await login(username, password)

    if (token) {
      try {
        await setStorageItem('auth-token', token)
      } catch (e) {
        // Restoring token failed
      }
    } else {
      setLoginError(true)
    }
  }, [login, password, username])

  const styled = useStyles(styles)

  return (
    <PageContainer keyboardShouldPersistTaps="always">
      <KeyboardAvoidingView style={styled.container} behavior="height">
        <Text variant="headlineLarge" style={styled.header}>
          StudentManager
        </Text>
        {hasLoginError && (
          <Text variant="bodyMedium" style={styled.message}>
            Username or password incorrect
          </Text>
        )}

        <TextInput
          blurOnSubmit={false}
          style={styled.input}
          autoComplete="username"
          label="Username"
          mode="outlined"
          value={username}
          onChangeText={text => setUsername(text)}
        />

        <TextInput
          blurOnSubmit={false}
          style={styled.input}
          autoComplete="password"
          label="Password"
          mode="outlined"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />

        <Button mode="contained" style={styled.button} labelStyle={styled.buttonText} onPress={handleLogin}>
          Login
        </Button>
      </KeyboardAvoidingView>
    </PageContainer>
  )
})
