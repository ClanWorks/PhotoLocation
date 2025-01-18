import pygame
import sys
import urllib.request
from io import BytesIO

pygame.init()

# Screen settings
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("PhotoLocation")

# Colors
BLUE = (0, 0, 255)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# Font setup
font = pygame.font.Font(None, 74)
text = font.render("Ready to Start", True, WHITE)
text_start = font.render("Game Started!", True, WHITE)

# Game state
game_started = False

# Load image from URL
image_url = "https://upload.wikimedia.org/wikipedia/commons/5/59/View_of_Prague_from_the_Castle_Staircase_by_W._M._R._Quick.jpg"
image_data = urllib.request.urlopen(image_url).read()
image = pygame.image.load(BytesIO(image_data))

# Main loop
clock = pygame.time.Clock()
running = True

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN and not game_started:
            game_started = True

    # Fill screen with blue
    screen.fill(BLUE)

    # Show the ready to start text if the game hasn't started
    if not game_started:
        screen.blit(text, (150, 250))
    else:
        screen.fill(BLACK)  # Change background when the game starts
        screen.blit(text_start, (200, 250))  # Display game started message

        # Display the image
        screen.blit(image, (150, 100))  # You can adjust (150, 100) to position the image

    pygame.display.flip()
    clock.tick(60)

pygame.quit()
sys.exit()

