import * as _ from "ramda";
import { Board } from "../objects/Board";
import { BoardSize } from "../objects/BoardSize";
import { Coords } from "../objects/Coords";
import { GameState } from "../objects/GameState";
import { Player } from "../objects/Player";

// wee lad full of reusable functions

export class Utils {
  public static getRandomObjectKey(object: object) {
    const keys = Object.keys(object);
    return this.returnRandomKey(keys);
  }

  public static getRandomArrayKey(array: object[]) {
    const keys = _.keys(array);
    return this.returnRandomKey(keys);
  }

  public static returnRandomKey(keys: any[]) {
    if (keys.length === 0) {
      return false;
    }
    return keys[(keys.length * Math.random()) << 0];
  }

  public static removeParams(params: object, removeList: string[]) {
    const goodParams = {};
    for (const i in params) {
      if (removeList.indexOf(i) === -1) {
        goodParams[i] = params[i];
      }
    }
    return goodParams;
  }

  public static correctForOverflow(
    coords: Coords,
    boardSize: BoardSize
  ): Coords {
    let newX;
    let newY;
    if (coords.x < 0) {
      newX = boardSize.width - 1;
    } else if (coords.x >= boardSize.width) {
      newX = 0;
    } else {
      newX = coords.x;
    }

    if (coords.y < 0) {
      newY = boardSize.height - 1;
    } else if (coords.y >= boardSize.height) {
      newY = 0;
    } else {
      newY = coords.y;
    }
    return coords.modify({ x: newX, y: newY });
  }

  public static flattenArray(arr: any[]) {
    return [].concat.apply([], arr);
  }

  public static removeDuplicates(arr: any[]) {
    return arr.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  }

  // todo : a Maybe?
  public static getPlayerByValue(playerTypes, value: number) {
    for (const i in playerTypes) {
      if (playerTypes[i].value === value) {
        return playerTypes[i];
      }
    }
    return false;
  }

  public static getPlayerByType(playerTypes, type: string) {
    for (const i in playerTypes) {
      if (playerTypes[i].type === type) {
        return playerTypes[i];
      }
    }
    return false;
  }

  // check leftovers on board and whether player is over finish tile
  public static checkLevelIsCompleted(gameState: GameState): boolean {
    const collectable = Utils.countCollectable(gameState.board);
    const playerCount: number = Utils.countPlayers(gameState.players);
    return collectable < 1 && playerCount < 2;
  }

  public static countPlayers(players: Player[]): number {
    const validPlayers = players.filter(player => {
      return player && player.value > 0;
    });
    return validPlayers.length;
  }

  // get total outstanding points left to grab on board
  public static countCollectable(board: Board): number {
    const tiles = board.getAllTiles();
    return tiles.reduce((collectable, tile) => {
      const score = tile.collectable;
      if (score > 0) {
        return collectable + score;
      }
      return collectable;
    }, 0);
  }
}
