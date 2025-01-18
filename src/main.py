import pygame
import sys

pygame.init()

# Screen settings
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("PhotoLocation")

# Colors
BLUE = (0, 0, 255)
WHITE = (255, 255, 255)

# Font setup
font = pygame.font.Font(None, 74)
text = font.render("Ready to Start", True, WHITE)

# Main loop
clock = pygame.time.Clock()
running = True

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    screen.fill(BLUE)
    screen.blit(text, (150, 250))

    pygame.display.flip()
    clock.tick(60)

pygame.quit()
sys.exit()

