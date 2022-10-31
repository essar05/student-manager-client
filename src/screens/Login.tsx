import * as React from 'react'
import { AppStackScreenProps } from '../navigation/types'
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native'
import { Button, MD3Theme, Text, TextInput, useTheme } from 'react-native-paper'
import { PageContainer } from '../components/PageContainer'
import { memo, useCallback, useState } from 'react'
import { useStore } from '../shared/hooks/useStore'
import { setStorageItem } from '../shared/storage'

export const Login = memo((props: AppStackScreenProps<'Login'>) => {
  const [hasLoginError, setLoginError] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = useStore(state => state.login)

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

  const theme = useTheme()
  const styles = makeStyles(theme)

  return (
    <PageContainer keyboardShouldPersistTaps="always">
      <KeyboardAvoidingView style={styles.container} behavior="height">
        <Text variant="headlineLarge" style={styles.header}>
          StudentManager
        </Text>
        {hasLoginError && (
          <Text variant="bodyMedium" style={styles.message}>
            Username or password incorrect
          </Text>
        )}

        <TextInput
          blurOnSubmit={false}
          style={styles.input}
          autoComplete={'username'}
          label="Username"
          mode={'outlined'}
          value={username}
          onChangeText={text => setUsername(text)}
        />

        <TextInput
          blurOnSubmit={false}
          style={styles.input}
          autoComplete={'password'}
          label="Password"
          mode={'outlined'}
          secureTextEntry={true}
          value={password}
          onChangeText={text => setPassword(text)}
        />

        <Button mode={'contained'} style={styles.button} labelStyle={styles.buttonText} onPress={handleLogin}>
          Login
        </Button>
      </KeyboardAvoidingView>
    </PageContainer>
  )
})

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      minHeight: '100%',
      flex: 1,
      padding: 20,
      width: '100%',
      maxWidth: 340,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      color: theme.colors.primary,
      fontWeight: 'bold',
      paddingVertical: 30,
    },
    message: {
      fontWeight: 'bold',
      paddingVertical: 5,
    },
    input: {
      width: '100%',
      marginVertical: 5,
    },
    button: {
      width: '100%',
      marginVertical: 20,
    },
    buttonText: {
      color: theme.colors.inverseSurface,
      fontWeight: 'bold',
      fontSize: 15,
      lineHeight: 26,
    },
  })
