document.addEventListener('DOMContentLoaded', function () {
	// Переключение бургер-меню
	const burger = document.querySelector('.header__burger')
	const nav = document.querySelector('.header__nav')

	burger.addEventListener('click', function () {
		this.classList.toggle('active')
		nav.classList.toggle('active')
	})

	// Плавный скролл для пунктов меню
	const menuLinks = document.querySelectorAll('.header__menu a, .header__cta')
	menuLinks.forEach(link => {
		link.addEventListener('click', function (e) {
			e.preventDefault()
			const targetId = this.getAttribute('href').substring(1)
			const targetElement = document.getElementById(targetId)
			if (targetElement) {
				targetElement.scrollIntoView({ behavior: 'smooth' })
				// Закрываем меню на мобильных после клика
				if (nav.classList.contains('active')) {
					burger.classList.remove('active')
					nav.classList.remove('active')
				}
			}
		})
	})

	// Плавный скролл для кнопок "Записаться на приём"
	const appointmentButtons = document.querySelectorAll('.btn--primary')
	appointmentButtons.forEach(button => {
		button.addEventListener('click', function (e) {
			e.preventDefault()
			const footer = document.getElementById('footer')
			if (footer) {
				footer.scrollIntoView({ behavior: 'smooth' })
			}
		})
	})

	// Плавный скролл для кнопки "Посмотреть услуги"
	const servicesButton = document.querySelector('.btn--secondary')
	if (servicesButton) {
		servicesButton.addEventListener('click', function (e) {
			e.preventDefault()
			const servicesSection = document.getElementById('services')
			if (servicesSection) {
				servicesSection.scrollIntoView({ behavior: 'smooth' })
			}
		})
	}
})
