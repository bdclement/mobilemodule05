
import { useResponsiveContext } from "../context/ResponsiveContext";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../screens/HomePage';
import CalendarScreen from '../screens/Calendar';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

export default function Home() {
    const { height, width, moderateScale } = useResponsiveContext();
    const isLandscape = width > height
    return (
            <NavigationContainer>
              <Tab.Navigator screenOptions={{ 
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                      backgroundColor: "#1a1818",
                      height: isLandscape ? moderateScale(35) : moderateScale(80),
                      borderTopWidth: 0,
                    },
                    tabBarActiveTintColor: "#0e6f03c5",
                    tabBarInactiveTintColor: "#888",
                    tabBarIconStyle: {
                        height: moderateScale(30),
                        width: moderateScale(25),
                    },
                    tabBarItemStyle: {
                        paddingVertical: isLandscape ? moderateScale(8) : moderateScale(6),
                    },
                }}
              >
                <Tab.Screen 
                    name="Home"
                    component={HomePage}
                    options={{
                      tabBarIcon: ({ focused, color, size }) => (
                        <FontAwesome
                          name={ "home" }
                          size={size}
                          color={color}
                        />
                      ),
                    }}
                />
                <Tab.Screen 
                    name="Calendar"
                    component={CalendarScreen}
                    options={{
                      tabBarIcon: ({ focused, color, size }) => (
                        <MaterialIcons
                          name={ "calendar-month" }
                          size={size}
                          color={color}
                        />
                      ),
                      tabBarShowLabel: false
                    }}
                 />
              </Tab.Navigator>
            </NavigationContainer>
    )
}
