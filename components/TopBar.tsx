import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

interface TopbarProps {
    isStencilProcessing: boolean;
    isTracing: boolean;
    stencilOutput: string | null;
    traceOutput: string | null;
		showExportPanel: boolean;
		setShowExportPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Topbar({ 
    isStencilProcessing,
    isTracing,
    stencilOutput, 
    traceOutput,
		showExportPanel,
		setShowExportPanel
}: TopbarProps) {
	const disabled =
		isStencilProcessing || isTracing || (!traceOutput && !stencilOutput);

    return (
			<View style={{ marginTop: 60, marginEnd: 10, alignItems: 'flex-end' }}>
				<TouchableOpacity
					onPress={() => setShowExportPanel(!showExportPanel)}
					disabled={disabled}
					style={{
					paddingRight: 12,
					borderRadius: 8,
					zIndex: 10,
					opacity: disabled ? 0.5 : 1
					}}>
					<MaterialCommunityIcons name="content-save-move-outline" size={28} color="white" />
				</TouchableOpacity>
			</View>
	);
}