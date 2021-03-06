module Sample.Prefab {

    export class Runner extends Phaser.Sprite implements IDirection {
        gravity:number = 300;
        velocity:number = 100;
        direction:Direction = Direction.Right;

        constructor(game:Phaser.Game, x:number, y:number) {
            super(game, x, y, 'runner');

            game.physics.arcade.enable(this);
            this.body.gravity.y = this.gravity;
            this.anchor.set(0.5, 0.5);

            this.alive = true;
            this.health = 10;

            game.add.existing(this);
        }

        update() {
            if (!this.inCamera) return;

            if (this.body.blocked.left) {
                this.direction = Direction.Right;
            } else if (this.body.blocked.right) {
                this.direction = Direction.Left;
            }

            switch (this.direction) {
                case Direction.Left :
                    this.body.velocity.x = -this.velocity;
                    break;
                case Direction.Right :
                    this.body.velocity.x = this.velocity;
                    break;
                default :
                    this.body.velocity.x = 0;
            }
        }
    }
}