import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, Button, Text, View } from 'react-native';
import { generateText } from '../../components/OpenAIService';

const Helper = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');

  const handleGenerateText = async () => {
    try {
      const text = await generateText(prompt);
      setResult(text);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your prompt"
          value={prompt}
          onChangeText={setPrompt}
        />
        <Button title="Generate Text" onPress={handleGenerateText} />
      </View>
      {result && <Text style={styles.result}>{result}</Text>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
  },
  result: {
    marginTop: 24,
    fontSize: 16,
  },
});

export default Helper;