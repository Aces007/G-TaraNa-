import React, {useEffect, useState} from 'react';
import { View, TouchableOpacity, FlatList, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAppContext } from '../AppContext';
import { useTheme } from '../ThemeContext';
import { useFonts } from 'expo-font';
import { safeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';


const ViewClasses = ({ navigation }) => {
    const { userId, fetchCoachClasses, fetchUserClasses, fetchUserData } = useAppContext();
    const [userRole, setUserRole] = useState('');
    const [classes, setClasses] = useState([]);
    const { isDarkMode, toggleTheme, currentTheme } = useTheme();
    const [selectedTheme, setSelectedTheme] = useState(isDarkMode ? 'dark' : 'light');

    useEffect(() => {
        console.log('userId in UserProfile:', userId);
        const getUserData = async () => {
            const userData = await fetchUserData(userId);
            setUserRole(userData.user_role)
        };

        getUserData();
    }, [userId]);
    
    
    useEffect(() => {
        const showCoachClasses = async () => {
            const myClasses = await fetchCoachClasses(userId);
            setClasses(myClasses);
        };
        
        const showAllClasses = async () => {
            const myClasses = await fetchUserClasses(userId);
            setClasses(myClasses);
        };

        if (userRole === 'coach') {
            showCoachClasses();
        } else {
            showAllClasses();
        }
        
    }, [userId]);

    const renderClasses = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('mainTabs')}>
            <View style={[styles.classLists, {borderColor: currentTheme.borderColor}]}>
                <Text style={[styles.className, {color: currentTheme.textColor}]}>{item.class_name}</Text>
                <Text style={[styles.classCode, {color: currentTheme.textColor}]}>Class Code: {item.class_code}</Text>
            </View>
        </TouchableOpacity>
    )

    useEffect(() => {
        setSelectedTheme(isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const handleThemeChange = async (theme) => {
        setSelectedTheme(theme);

        await AsyncStorage.setItem('theme', theme);
        if ((theme === 'dark' && !isDarkMode) || (theme === 'light' && isDarkMode)) {
            toggleTheme();
        }
    };

    const [fontsLoaded] = useFonts({
        'Poppins-ExtraB': require('../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
        'Montserrat-ExtraB': require('../assets/fonts/Montserrat/static/Montserrat-ExtraBold.ttf'),
        'Montserrat-Bold': require('../assets/fonts/Montserrat/static/Montserrat-Bold.ttf'),
        'Montserrat-Med': require('../assets/fonts/Montserrat/static/Montserrat-Medium.ttf'),
        'Montserrat-Reg': require('../assets/fonts/Montserrat/static/Montserrat-Regular.ttf'),
        'RedHat-Bold': require('../assets/fonts/Red_Hat_Display/static/RedHatDisplay-Bold.ttf'),
    });

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#A8F94F" />
            </View>
        );
    }


    return(
        <View style={[styles.mainCont, {backgroundColor: currentTheme.backgroundColor}]}>
            <View style={[styles.headerCont, {backgroundColor: currentTheme.backgroundColor}]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('User')}>
                    <Ionicons name='arrow-back' color="white" size={25} style={[styles.manageSVG, {color: currentTheme.textColor}]} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.classBtn} onPress={() => userRole === 'user' ? navigation.navigate('JoinClass') : navigation.navigate('CreateClass')}>
                    <Ionicons name='add-circle-outline' size={25} color={currentTheme.textColor} style={styles.manageSVG} />
                </TouchableOpacity>
            </View>

            <Text style={[styles.classCont, {color: currentTheme.textColor}]}>My Classes</Text>


            <FlatList
                data={classes}
                renderItem={renderClasses}
                keyExtractor={(item) => item.id.toString()}
                style={[styles.classListCont, {color: currentTheme.textColor, borderColor: currentTheme.textColor}]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mainCont: {
        flexGrow: 1,
        backgroundColor: '#0a0f1b',
        padding: 20,
        paddingTop: 55,
    },
    headerCont: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 30,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    classCont: {
        color: '#FFF',
        fontSize: 28,
        fontFamily: 'Montserrat-ExtraB',
        textTransform: 'uppercase',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 25,
    },
    classLists: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderWidth: 2,
        borderRadius: 5,
        marginBottom: 40,
    },
    className: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 25,
    },
    classCode: {
        fontFamily: 'Montserrat-Med',
        fontSize: 18,
    },
    classListCont: {
        marginVertical: 25,
    },
})  


export default ViewClasses;