const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreBoard = document.getElementById('scoreBoard');

const COLORS = [
    '#FF0000', '#FF7F00', '#FFFF00', 
    '#00FF00', '#0000FF', '#4B0082', '#9400D3'
];

class Game {
    constructor() {
        this.reset();
    }

    reset() {
        this.score = 0;
        this.lives = 3;
        this.paddle = {
            x: 350,
            width: 200,
            height: 20,
            color: '#FFFFFF'
        };
        this.ball = {
            x: 400,
            y: 500,
            radius: 15,
            dx: 7,
            dy: -7,
            color: '#FFFFFF'
        };
        this.bricks = this.createBricks();
    }

    createBricks() {
        const bricks = [];
        const rowCount = 7;
        const colCount = 10;
        const brickWidth = 75;
        const brickHeight = 30;
        const padding = 10;

        for (let r = 0; r < rowCount; r++) {
            for (let c = 0; c < colCount; c++) {
                bricks.push({
                    x: c * (brickWidth + padding) + 35,
                    y: r * (brickHeight + padding) + 50,
                    width: brickWidth,
                    height: brickHeight,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    visible: true
                });
            }
        }
        return bricks;
    }

    drawPaddle() {
        ctx.beginPath();
        ctx.fillStyle = this.randomColor();
        ctx.fillRect(this.paddle.x, 550, this.paddle.width, this.paddle.height);
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.paddle.color;
    }

    drawBall() {
        ctx.beginPath();
        ctx.fillStyle = this.randomColor();
        ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 50;
        ctx.shadowColor = this.ball.color;
    }

    drawBricks() {
        this.bricks.forEach(brick => {
            if (brick.visible) {
                ctx.beginPath();
                ctx.fillStyle = brick.color;
                ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            }
        });
    }

    moveBall() {
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        if (this.ball.x + this.ball.radius > canvas.width || this.ball.x - this.ball.radius < 0) {
            this.ball.dx *= -1;
            document.body.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
            this.ball.radius = Math.random() * 30 + 10;
        }

        if (this.ball.y - this.ball.radius < 0) {
            this.ball.dy *= -1;
            canvas.style.transform = `scale(${Math.random() * 0.2 + 0.9}) rotate(${Math.random() * 20 - 10}deg)`;
        }

        if (
            this.ball.y + this.ball.radius > 550 &&
            this.ball.x > this.paddle.x &&
            this.ball.x < this.paddle.x + this.paddle.width
        ) {
            this.ball.dy *= -1;
            this.ball.dx += (this.ball.x - (this.paddle.x + this.paddle.width / 2)) / 10;
        }

        this.bricks.forEach(brick => {
            if (brick.visible) {
                if (
                    this.ball.x > brick.x &&
                    this.ball.x < brick.x + brick.width &&
                    this.ball.y > brick.y &&
                    this.ball.y < brick.y + brick.height
                ) {
                    this.ball.dy *= -1;
                    brick.visible = false;
                    this.score += 10;
                    scoreBoard.textContent = `Score: ${this.score}`;
                    canvas.style.filter = `hue-rotate(${Math.random() * 360}deg) brightness(${Math.random() * 200}%)`;
                }
            }
        });

        if (this.ball.y + this.ball.radius > canvas.height) {
            this.lives--;
            if (this.lives === 0) {
                this.reset();
            } else {
                this.ball.x = 400;
                this.ball.y = 500;
            }
        }
    }

    randomColor() {
        return COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        this.drawBricks();
        this.drawPaddle();
        this.drawBall();
        this.moveBall();

        if (this.bricks.every(brick => !brick.visible)) {
            this.reset();
        }

        requestAnimationFrame(() => this.update());
    }
}

const game = new Game();

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    game.paddle.x = e.clientX - rect.left - game.paddle.width / 2;
    game.paddle.x = Math.max(0, Math.min(canvas.width - game.paddle.width, game.paddle.x));
});

game.update();
