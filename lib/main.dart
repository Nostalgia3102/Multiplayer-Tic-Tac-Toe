import 'package:flutter/material.dart';
import 'package:mp_tic_tac_toe/provider/room_data_provider.dart';
import 'package:mp_tic_tac_toe/screens/create_room_screen.dart';
import 'package:mp_tic_tac_toe/screens/game_screen.dart';
import 'package:mp_tic_tac_toe/screens/join_room_screen.dart';
import 'package:mp_tic_tac_toe/screens/main_menu_screen.dart';
import 'package:mp_tic_tac_toe/utils/colors.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(const MyApp());
}

//Learning : in flutter (dart)
//Futures -> takes a req and send it.   ==  similar to http client (one way)
//Streams -> can take a req -> send it -> listens it (until gets unsubscribed)  == similar to socket.io (two way)

//similar example in firebase :
// snapshot -> Streams -> Socket io
// get -> Future -> http module

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => RoomDataProvider(),
      child: MaterialApp(
        title: 'Flutter Demo',
        theme: ThemeData.dark().copyWith(
          scaffoldBackgroundColor: bgColor,
        ),
        routes: {
          MainMenuScreen.routeName: (context) => const MainMenuScreen(),
          JoinRoomScreen.routeName: (context) => const JoinRoomScreen(),
          CreateRoomScreen.routeName: (context) => const CreateRoomScreen(),
          GameScreen.routeName: (context) => const GameScreen(),
        },
        initialRoute: MainMenuScreen.routeName,
      ),
    );
  }
}