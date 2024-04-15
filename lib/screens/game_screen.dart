import 'package:flutter/material.dart';
import 'package:mp_tic_tac_toe/provider/room_data_provider.dart';
import 'package:mp_tic_tac_toe/resources/socket_methods.dart';
import 'package:mp_tic_tac_toe/views/scoreboard.dart';
import 'package:mp_tic_tac_toe/views/tictactoe_board.dart';
import 'package:mp_tic_tac_toe/views/waiting_lobby.dart';
import 'package:provider/provider.dart';

class GameScreen extends StatefulWidget {
  static String routeName = '/game';
  const GameScreen({super.key});

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> {
  final SocketMethods _socketMethods = SocketMethods();

  @override
  void initState() {
    super.initState();
    _socketMethods.updateRoomListener(context);
    _socketMethods.updatePlayersStateListener(context);
    _socketMethods.pointIncreaseListener(context);
    _socketMethods.endGameListener(context);
  }

  @override
  Widget build(BuildContext context) {
    RoomDataProvider roomDataProvider = Provider.of<RoomDataProvider>(context);

    debugPrint("the value is ${roomDataProvider.roomData}");
    return Scaffold(
      appBar: AppBar(
        title: const Text('MP Tic Tac Toe'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
      ),
      // body: Text(roomDataProvider.roomData.toString()),
      body: (roomDataProvider.roomData['isJoin'])
          ? const WaitingLobby()
          : SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
             const Scoreboard(),
             const TicTacToeBoard(),
              Text(
                roomDataProvider.roomData['turn'] != null
                    ? '${roomDataProvider.roomData['turn']['nickname']}\'s turn'
                    : 'Waiting for next turn',),
          ],
        ),
      ),
    );
  }
}