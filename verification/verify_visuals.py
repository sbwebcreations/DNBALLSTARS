from playwright.sync_api import sync_playwright, expect

def verify_visuals():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # 1. Desktop Verification
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        page.goto("http://localhost:8080")

        print("Verifying Hero Button Color...")
        hero_btn = page.locator('.hero__btn')
        expect(hero_btn).to_be_visible()
        # Expect White BG (rgb(255, 255, 255))
        expect(hero_btn).to_have_css('background-color', 'rgb(255, 255, 255)')
        # Expect Black Text (rgb(0, 0, 0))
        expect(hero_btn).to_have_css('color', 'rgb(0, 0, 0)')

        print("Verifying Countdown Styling...")
        countdown_item = page.locator('.countdown__item').first
        # Expect transparent background
        expect(countdown_item).to_have_css('background-color', 'rgba(0, 0, 0, 0)')

        print("Verifying Headliners Section...")
        headliners = page.locator('.headliners')
        expect(headliners).to_be_visible()
        expect(headliners.locator('.section__title')).to_have_text("THE HEADLINERS")
        # Expect 4 cards
        cards = headliners.locator('.card')
        expect(cards).to_have_count(4)

        print("Verifying Hype Section Images...")
        hype = page.locator('.hype')
        expect(hype.locator('.card')).to_have_count(3)
        expect(hype.locator('.card__image img').first).to_be_visible()

        print("Taking Visual Polish Screenshot...")
        page.screenshot(path="verification/visual_polish.png", full_page=True)

        browser.close()
        print("Verification Complete.")

if __name__ == "__main__":
    verify_visuals()
