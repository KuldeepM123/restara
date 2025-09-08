import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function BackgroundVideo() {
  const videoHTML = `
    <html>
      <body style="margin:0;padding:0;overflow:hidden;background:black">
        <video autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover">
          <source src="background_animation_1.mp4" type="video/mp4" />
        </video>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: videoHTML }}
        originWhitelist={['*']}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>✨ Welcome ✨</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
});
