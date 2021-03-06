module Sample.Prefab {

    export class Player extends Phaser.Sprite implements IDirection {
        gravity:number = 300;

        acceleration:number = 1000;
        drag:number = 1000;

        maxSpeed:number = 300;
        superSpeedPower:number = 600;

        damagePoint:number = 30;
        jumpPower:number = 300;

        immortalState:boolean = false;
        attackState:boolean = false;
        moveState:boolean = false;
        sitState:boolean = false;
        superSpeedState:boolean = false;
        superAttakState:boolean = false;

        direction:Direction = Direction.Right;

        healthPoints:number = 10000;
        manaPoints:number = 100;

        immortalStateAt:number = Date.now();
        attackStateAt:number = Date.now();

        immortalDuration:number = 3000;
        attackDuration:number = 300;

        isActiveJumpKey:boolean = false;
        isAttackKeyPressed:boolean = false;

        constructor(game:Phaser.Game, x:number, y:number) {
            super(game, x, y, 'player');

            game.physics.arcade.enable(this);
            this.body.gravity.y = this.gravity;
            this.anchor.set(0.5, 1);

            this.body.drag.x = this.drag;
            this.body.maxVelocity.x = this.maxSpeed;

            this.alive = true;
            this.health = this.healthPoints;

            //this.smoothed = true;

            this.animations.add('stay', ['player-walk-1.png'], 10, true)
            this.animations.add('walk', Phaser.Animation.generateFrameNames('player-walk-', 1, 4, '.png', 0), 10, true);
            this.animations.add('attack', Phaser.Animation.generateFrameNames('player-attack-', 1, 3, '.png', 0), 10, true);
            this.animations.add('sit', ['player-sit-1.png'], 10, true);

            game.add.existing(this);
        }

        makeDamage(damagePoint) {
            this.damage(damagePoint);
            this.immortalStateAt = Date.now();
            this.immortalState = true;
            this.alpha = 0.5;
        }

        jump() {
            if (this.game.input.keyboard.isDown(settings.keys.jump)
                && this.body.blocked.down
                && !this.isActiveJumpKey) {
                this.isActiveJumpKey = true;
                this.body.velocity.y = -this.jumpPower;
            }

            if (!this.game.input.keyboard.isDown(settings.keys.jump)) {
                this.isActiveJumpKey = false;
            }
        }

        move() {
            if (this.game.input.keyboard.isDown(settings.keys.moveRight)) {
                this.moveState = true;
                this.body.acceleration.x = this.acceleration;
                this.direction = Direction.Right;
                this.scale.x = 1;
            }
            else if (this.game.input.keyboard.isDown(settings.keys.moveLeft)) {
                this.moveState = true;
                this.body.acceleration.x = -this.acceleration;
                this.direction = Direction.Left;
                this.scale.x = -1;
            }
            else {
                this.moveState = false;
                this.body.acceleration.x = 0;
            }
        }

        attack() {
            if (this.game.input.keyboard.isDown(settings.keys.attack) && !this.attackState && !this.isAttackKeyPressed) {
                this.isAttackKeyPressed = true;
                this.attackState = true;
                this.attackStateAt = Date.now();
            }

            if (!this.game.input.keyboard.isDown(settings.keys.attack)) {
                this.isAttackKeyPressed = false;
            }

            if ((Date.now() - this.attackStateAt) > this.attackDuration) {
                this.attackState = false;
            }
        }

        superSpeed() {
            if (this.game.input.keyboard.isDown(settings.keys.superSpeed) && this.body.blocked.down && !this.attackState) {
                this.superSpeedState = true;
            }

            if (!this.game.input.keyboard.isDown(settings.keys.superSpeed)) {
                this.superSpeedState = false;
            }

            if (this.superSpeedState) {
                this.body.maxVelocity.x = this.superSpeedPower;
            } else {
                this.body.maxVelocity.x = this.maxSpeed;
            }
        }

        superAttack() {
            // distance attack
        }

        sit() {
            if (this.game.input.keyboard.isDown(settings.keys.sit)) {
                this.sitState = true;
            }

            if (!this.game.input.keyboard.isDown(settings.keys.sit)) {
                this.sitState = false;
            }
        }

        state() {
            if (this.immortalState && (Date.now() - this.immortalStateAt) > this.immortalDuration) {
                this.alpha = 1;
                this.immortalState = false;
            }

            if (this.attackState) {
                this.animations.play('attack');
            } else if (this.moveState) {
                this.animations.play('walk');
            } else if (this.sitState) {
                this.animations.play('sit');
            } else {
                this.animations.play('stay');
            }

            this.body.width = this.animations.currentFrame.width;
            this.body.height = this.animations.currentFrame.height;
        }

        update() {
            this.move();
            this.jump();
            this.attack();
            this.sit();
            this.superSpeed();
            this.superAttack();

            this.state();
        }
    }
}