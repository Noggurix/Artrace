import type { ControlType } from '@/types/controls.ts';
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { EdgeInsets } from 'react-native-safe-area-context';

interface BottomToolBarProps{
	insets: EdgeInsets;
	activeControl: ControlType | null;
	setActiveControl: (v: ControlType | null) => void;
}

export default function BottomToolBar({
	insets,
	activeControl,
	setActiveControl
}: BottomToolBarProps) {

	const handlePress = (control: ControlType) => {
		setActiveControl(activeControl === control ? null : control);
	};

	return (
		<View style={[styles.buttonRow, { paddingBottom: insets.bottom }]}>
			<TouchableOpacity style={styles.button} onPress={() => handlePress('image')}>
				<MaterialIcons name="settings-brightness" size={28} color={activeControl === 'image' ? 'lightblue' : 'white'} />
				<Text style={[styles.buttonText, activeControl === 'image' && styles.buttonTextActive]}>Image</Text>
			</TouchableOpacity>

			<TouchableOpacity style={styles.button} onPress={() => handlePress('stencil')}>
				<MaterialIcons name="lens-blur" size={28} color={activeControl === 'stencil' ? 'lightblue' : 'white'} />
				<Text style={[styles.buttonText, activeControl === 'stencil' && styles.buttonTextActive]}>Stencil</Text>
			</TouchableOpacity>

			<TouchableOpacity style={styles.button} onPress={() => handlePress('trace')}>
				<MaterialIcons name="border-style" size={28} color={activeControl === 'trace' ? 'lightblue' : 'white'} />
				<Text style={[styles.buttonText, activeControl === 'trace' && styles.buttonTextActive]}>Trace</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
  buttonRow: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0b0e15ff',
    borderRadius: 15,
    zIndex: 10,
  },
  button: {
    padding: 10
  },
  buttonText: {
		color: 'white',
		fontSize: 10,
		textAlign: 'center',
  },
  buttonTextActive: {
    color: 'lightblue',
  }
});