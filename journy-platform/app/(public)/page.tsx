'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/app/styles/homePage.module.scss';
import { SelectLanguage } from '@/components/layout/SelectLanguage';
import { Footer } from '@/components/layout/Footer';

// Import all language files
import en from '@/lib/i18n/homePage/en.json';
import it from '@/lib/i18n/homePage/it.json';
import fr from '@/lib/i18n/homePage/fr.json';
import es from '@/lib/i18n/homePage/es.json';
import sv from '@/lib/i18n/homePage/sv.json';
import pt from '@/lib/i18n/homePage/pt.json';
import el from '@/lib/i18n/homePage/el.json';
import bg from '@/lib/i18n/homePage/bg.json';
import hr from '@/lib/i18n/homePage/hr.json';
import cs from '@/lib/i18n/homePage/cs.json';
import da from '@/lib/i18n/homePage/da.json';
import nl from '@/lib/i18n/homePage/nl.json';
import et from '@/lib/i18n/homePage/et.json';
import fi from '@/lib/i18n/homePage/fi.json';
import de from '@/lib/i18n/homePage/de.json';
import hu from '@/lib/i18n/homePage/hu.json';
import ga from '@/lib/i18n/homePage/ga.json';
import lv from '@/lib/i18n/homePage/lv.json';
import lt from '@/lib/i18n/homePage/lt.json';
import mt from '@/lib/i18n/homePage/mt.json';
import pl from '@/lib/i18n/homePage/pl.json';
import ro from '@/lib/i18n/homePage/ro.json';
import sk from '@/lib/i18n/homePage/sk.json';
import sl from '@/lib/i18n/homePage/sl.json';

export default function Home() {
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [expandedCard, setExpandedCard] = useState<number | null>(null);
    const faqRef = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [translatedText, setTranslatedText] = useState<Record<string, string>>({});
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        // Initialize language from localStorage (client-side only)
        if (typeof window !== 'undefined') {
            const savedLang = localStorage.getItem('language') || 'en';
            setLanguage(savedLang);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', language);
        }
    }, [language]);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value);

    useEffect(() => {
        const languages: Record<string, any> = {
            en, it, fr, es, sv, pt, el, bg, hr, cs, da, nl, et, fi, de, hu, ga, lv, lt, mt, pl, ro, sk, sl
        };
        setTranslatedText(languages[language] || en);
    }, [language]);

    const faqData = [
        {
            question: translatedText['What is Journy?'],
            answer: translatedText['What is Journy text'],
        },
        {
            question: translatedText['How do E-labels work?'],
            answer: translatedText['How do E-labels work text'],
        },
        {
            question: translatedText['How many e-labels will I need?'],
            answer: `${translatedText['How many e-labels will I need text']}<br/><br/>
        ${translatedText['How many e-labels will I need 2025']}<br/><br/>
        ${translatedText['How many e-labels will I need 2026']}`,
            hasMore: true,
        },
        {
            question:
                translatedText[
                'Once I print the QR codes, can I edit the information?'
                ],
            answer: translatedText['QR codes edit information text'],
        },
        {
            question: translatedText['Do you calculate the energy content?'],
            answer: translatedText['Calculate energy text'],
        },
        {
            question:
                translatedText[`What happens if I don't follow the regulation?`],
            answer: translatedText['Follow regulations text'],
        },
        {
            question: translatedText['What kind of technology is Journy using?'],
            answer: `${translatedText['Blockchain and QR codes']}<br/><br/>
        ${translatedText['Blockchain explanation']}`,
            hasMore: true,
        },
    ];

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!faqRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - faqRef.current.offsetLeft);
        setScrollLeft(faqRef.current.scrollLeft);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !faqRef.current) return;
        e.preventDefault();
        const x = e.pageX - faqRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        faqRef.current.scrollLeft = scrollLeft - walk;
    };

    const toggleCard = (index: number) => {
        if (expandedCard === index) {
            setExpandedCard(null);
        } else {
            setExpandedCard(index);
        }
    };

    const scrollFAQ = (direction: 'left' | 'right') => {
        if (faqRef.current) {
            const scrollAmount = 300;
            faqRef.current.scrollLeft +=
                direction === 'left' ? -scrollAmount : scrollAmount;
        }
    };

    return (
        <div className={styles.homeContainer}>
            <nav className={styles.navbar}>
                <div className={styles['nav-content']}>
                    <img src="/assets/Images/logo.png" alt="Journy Logo" className={styles.logo} />

                    <button
                        className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <div
                        className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}
                    >
                        <SelectLanguage
                            handleLanguageChange={handleLanguageChange}
                            language={language}
                            styles={styles.languageSelect}
                        />
                        <Link href="/about" className={styles.navLink}>
                            {translatedText['About us']}
                        </Link>
                        <Link href="/login" className={styles.navLink}>
                            {translatedText['Log in']}
                        </Link>
                        <Link href="/signup" className={styles.signupButton}>
                            {translatedText['Sign up']}
                        </Link>
                    </div>
                </div>
            </nav>
            <div className={styles['home-container']}>
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    controls={false}
                    className={styles.backgroundVideo}
                >
                    <source src="/assets/desktop2.mp4" type="video/mp4" />
                </video>

                <div className={styles['content-wrapper']}>
                    <div className={styles['content-box']}>
                        <h1 className={styles.mainHeading}>
                            {translatedText['YOUR JOURNEY']},
                            <br />
                            {translatedText['IN EVERY SCAN']}.
                        </h1>
                        <p className={styles.subHeading}>
                            {
                                translatedText[
                                'Showcase Your Sustainability with Smart E-Labels'
                                ]
                            }
                            .
                        </p>
                    </div>
                    <div className={styles.startButtonWrapper}>
                        <Link href="/signup" className={styles.startButton}>
                            {translatedText['Start today']}
                        </Link>
                    </div>

                    <div className={styles.scrollDown}>
                        <img src="/assets/Images/arrow.svg" alt="Scroll" className={styles.scrollArrow} />
                        <span>{translatedText['Scroll down']}</span>
                    </div>
                </div>
            </div>
            <div className={styles.howItWorksSection}>
                <div className={styles.howItWorksHeader}>
                    <h3 className={styles.sectionTitle}>
                        {translatedText['HOW IT WORKS']}
                    </h3>
                    <h2 className={styles.mainTitle}>
                        {translatedText['SHARE YOUR JOURNEY IN 4 STEPS']}
                    </h2>
                    <div className={styles.showcaseVideoContainer}>
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            controls={false}
                        >
                            <source src="/assets/Landingpagedemo.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>

                <div className={styles.labelInteractionSection}>
                    <a
                        href="https://www.journy.se/product/497"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <button className={styles.labelButton}>
                            {translatedText['Click here to see an example']}
                        </button>
                    </a>
                    <img
                        src="/assets/Images/qrcode_example.png"
                        alt="Label Interaction"
                        className={styles.labelInteractionImage}
                    />
                    <img
                        src="/assets/Images/ContentMobile.png"
                        alt="Label Interaction Mobile"
                        className={styles.labelInteractionImageMobile}
                    />
                </div>
            </div>
            <div className={styles.wineTellsStorySection}>
                <h3 className={styles.whyLabelsTitle}>
                    {translatedText['WHY YOU NEED E-LABELS']}
                </h3>
                <h2 className={styles.storyTitle}>
                    {translatedText['YOUR WINE TELLS A STORY']}
                </h2>

                <div className={styles.storyContent}>
                    <p className={styles.storyText}>{translatedText['Wine Story']}</p>
                    <img
                        src="/assets/Images/WineTellsAStory.png"
                        alt="Wine Story"
                        className={styles.storyImage}
                    />
                </div>
            </div>
            <div className={styles.empowerSection}>
                <div className={styles.contentWrapper}>
                    <div className={styles.topRow}>
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            controls={false}
                            className={styles.video1}
                        >
                            <source src="/assets/video1.mp4" type="video/mp4" />
                        </video>
                        <img src="/assets/Images/bild1.png" alt="Vineyard" className={styles.image1} />
                        <img src="/assets/Images/bild2.jpg" alt="Wine" className={styles.image2} />
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            controls={false}
                            className={styles.video2}
                        >
                            <source src="/assets/video2.mp4" type="video/mp4" />
                        </video>
                        <img src="/assets/Images/bild3.jpg" alt="Grapes" className={styles.image3} />
                    </div>

                    <div className={styles.textSection}>
                        <p className={styles.empowerText}>
                            {
                                translatedText[
                                'We empower wine producers to meet the growing demands for'
                                ]
                            }{' '}
                            <span className={styles.highlight}>
                                {translatedText['transparency']}
                            </span>{' '}
                            {translatedText['and']}{' '}
                            <span className={styles.highlight}>
                                {translatedText['sustainability']}
                            </span>{' '}
                            {
                                translatedText[
                                'while turning environmental challenges into business opportunities'
                                ]
                            }
                            .
                            <br />
                            {
                                translatedText[
                                'With Journy, we make it possible for consumers to know'
                                ]
                            }
                            <br />
                            {
                                translatedText[
                                'who made their wine, how it was produced, and how their choices impact the planet'
                                ]
                            }
                            .
                        </p>
                    </div>

                    <div className={styles.bottomRow}>
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            controls={false}
                            className={styles.video3}
                        >
                            <source src="/assets/video3.mp4" type="video/mp4" />
                        </video>
                        <img src="/assets/Images/bild4.png" alt="Winery" className={styles.image4} />
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            controls={false}
                            className={styles.video4}
                        >
                            <source src="/assets/video4.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
            </div>
            <div className={styles.pricesSection}>
                <h3 className={styles.pricesTitle}>{translatedText['PRICES']}</h3>
                <h2 className={styles.planTitle}>
                    {translatedText['CHOOSE YOUR E-LABEL PLAN']}
                </h2>

                <div className={styles.priceCards}>
                    {/* FREE plan*/}
                    <div className={styles.priceCard}>
                        <h4 className={styles.labelCount}>{translatedText['3 labels']}</h4>
                        <p className={styles.price}>{translatedText['€ 0/year']}</p>
                        <ul className={styles.features}>
                            <li>
                                {
                                    translatedText[
                                    'Full compliance with EU e-labeling regulations'
                                    ]
                                }
                                .
                            </li>
                            <li>
                                {translatedText['Multilingual support in all EU languages']}.
                            </li>
                        </ul>
                        <Link href="/signup" className={styles.getStartedButton}>
                            {translatedText['Try for free']}
                        </Link>
                    </div>

                    {/* Basic Plan */}
                    <div className={styles.priceCard}>
                        <h4 className={styles.labelCount}>{translatedText['15 labels']}</h4>
                        <p className={styles.price}>{translatedText['€ 179/year']}</p>
                        <ul className={styles.features}>
                            <li>
                                {
                                    translatedText[
                                    'Full compliance with EU e-labeling regulations'
                                    ]
                                }
                                .
                            </li>
                            <li>
                                {translatedText['Multilingual support in all EU languages']}.
                            </li>
                        </ul>
                        <Link href="/signup" className={styles.getStartedButton}>
                            {translatedText['Get started']}
                        </Link>
                    </div>

                    {/* Standard Plan */}
                    <div className={styles.priceCard}>
                        <h4 className={styles.labelCount}>{translatedText['30 labels']}</h4>
                        <p className={styles.price}>{translatedText['€ 319/year']}</p>
                        <ul className={styles.features}>
                            <li>
                                {
                                    translatedText[
                                    'Full compliance with EU e-labeling regulations'
                                    ]
                                }
                                .
                            </li>
                            <li>
                                {translatedText['Multilingual support in all EU languages']}.
                            </li>
                        </ul>
                        <Link href="/signup" className={styles.getStartedButton}>
                            {translatedText['Get started']}
                        </Link>
                    </div>

                    {/* Premium Plan */}
                    <div className={styles.priceCard}>
                        <h4 className={styles.labelCount}>{translatedText['50 labels']}</h4>
                        <p className={styles.price}>{translatedText['€ 479/year']}</p>
                        <ul className={styles.features}>
                            <li>
                                {
                                    translatedText[
                                    'Full compliance with EU e-labeling regulations'
                                    ]
                                }
                                .
                            </li>
                            <li>
                                {translatedText['Multilingual support in all EU languages']}.
                            </li>
                        </ul>
                        <Link href="/signup" className={styles.getStartedButton}>
                            {translatedText['Get started']}
                        </Link>
                    </div>
                </div>
            </div>
            <div className={styles.aboutSection}>
                <h3 className={styles.aboutTitle}>{translatedText['WHO ARE WE']}</h3>
                <h2 className={styles.whyTitle}>{translatedText['WHY JOURNY?']}</h2>
                <p className={styles.aboutText}>{translatedText['WHO ARE WE text']}.</p>
                <Link href="/about" className={styles.learnMoreButton}>
                    {translatedText['Learn more']}
                </Link>
            </div>
            <div className={styles.readySection}>
                <div className={styles.textContent}>
                    <h2 className={styles.readyTitle}>
                        {translatedText['Are you ready to share your story?']}
                    </h2>
                    <p className={styles.readySubtitle}>
                        {translatedText['Stand out and make an impact with our e-labels']}.
                    </p>
                    <Link href="/signup" className={styles.readyButton}>
                        {translatedText['Start today']}
                    </Link>
                </div>
                <div className={styles.videoContainer}>
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        controls={false}
                        className={styles.qrVideo}
                    >
                        <source src="/assets/QrCode.mp4" type="video/mp4" />
                    </video>
                </div>
            </div>
            <div className={styles.faqSection}>
                <h3 className={styles.faqSubtitle}>
                    {translatedText['FAQ AND CONTACT']}
                </h3>
                <h2 className={styles.faqTitle}>
                    {translatedText['DO YOU HAVE ANY QUESTIONS?']}
                </h2>

                <button
                    className={`${styles.faqNavButton} ${styles.prev}`}
                    onClick={() => scrollFAQ('left')}
                >
                    <svg viewBox="0 0 24 24">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                </button>

                <button
                    className={`${styles.faqNavButton} ${styles.next}`}
                    onClick={() => scrollFAQ('right')}
                >
                    <svg viewBox="0 0 24 24">
                        <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                    </svg>
                </button>

                <div
                    ref={faqRef}
                    className={styles.faqContainer}
                    style={{
                        display: 'flex',
                        overflowX: 'auto',
                        scrollBehavior: 'smooth',
                        WebkitOverflowScrolling: 'touch',
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    <div className={styles.faqCardsWrapper}>
                        {faqData.map((faq, index) => (
                            <div
                                key={index}
                                className={`${styles.faqCard} ${expandedCard === index ? styles.expanded : ''
                                    }`}
                            >
                                <h3 className={styles.faqQuestion}>{faq.question}</h3>
                                <div className={styles.faqAnswerWrapper}>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                                        className={styles.faqAnswer}
                                    />
                                </div>
                                <button
                                    className={styles.readMore}
                                    onClick={() => toggleCard(index)}
                                >
                                    {expandedCard === index ? 'Read less' : 'Read more'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.contactSection}>
                <h2 className={styles.contactTitle}>{translatedText['CONTACT US']}</h2>
                <div className={styles.emailContainer}>
                    <div className={styles.decorativeLeft}></div>
                    <a href="mailto:hello@journy.se" className={styles.emailButton}>
                        hello@journy.se
                    </a>
                    <div className={styles.decorativeRight}></div>
                </div>
            </div>

            <footer className={styles.footer}>
                <div className={styles.logoSection}>
                    <img src="/assets/Images/logo.png" alt="Journy" className={styles.logo} />
                </div>

                <div className={styles.rightSection}>
                    <div className={styles.linkColumn}>
                        <a href="/signup">{translatedText['Sign up']}</a>
                        <a href="/login">{translatedText['Log in']}</a>
                    </div>
                    <div className={styles.linkColumn}>
                        <a href="/about">{translatedText['About us']}</a>
                        <a href="/contact">{translatedText['Contact']}</a>
                    </div>
                    <div className={styles.linkColumn}>
                        <a href="/privacy">{translatedText['Privacy Policy']}</a>
                        <a href="/terms">{translatedText['Terms & Conditions']}</a>
                    </div>
                </div>
            </footer>
            <Footer translatedText={translatedText} />
        </div>
    );
}
