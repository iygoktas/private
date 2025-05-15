document.addEventListener('DOMContentLoaded', () => {
    const TOTAL_PAGES = 10; // Sizin son kodunuzdaki değer
    let currentPage = 1;

    // --- DOM Elements ---
    const appContainer = document.getElementById('app-container');
    const coverPageDiv = document.getElementById('cover-page');
    const coverTitleElem = document.getElementById('cover-title');
    const openNotebookBtn = document.getElementById('open-notebook-btn');

    const notebookInteriorDiv = document.getElementById('notebook-interior');
    const fixedTitleElem = document.getElementById('fixed-title');
    const returnToCoverBtn = document.getElementById('return-to-cover-btn');

    const currentPageContentDiv = document.getElementById('current-page-content');
    const pageImageElem = document.getElementById('page-image');
    const pageTextElem = document.getElementById('page-text');

    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');

    let imageFocusOverlay;
    let focusedImageElem;

    function setupImageFocusElements() {
        imageFocusOverlay = document.getElementById('image-focus-overlay'); // HTML'de statik olarak yoksa oluşturulacak
        focusedImageElem = document.getElementById('focused-image'); // HTML'de statik olarak yoksa oluşturulacak

        if (!imageFocusOverlay) {
            imageFocusOverlay = document.createElement('div');
            imageFocusOverlay.id = 'image-focus-overlay';

            focusedImageElem = document.createElement('img');
            focusedImageElem.id = 'focused-image';
            focusedImageElem.alt = "Odaklanmış Resim"; // Turkish for "Focused Image"

            imageFocusOverlay.appendChild(focusedImageElem);
            document.body.appendChild(imageFocusOverlay);
        }

        imageFocusOverlay.addEventListener('click', (event) => {
            if (event.target === imageFocusOverlay) {
                hideImageFocus();
            }
        });
    }

    // --- Page Data ---
    const pagesData = [];
    const providedTexts = [
        'Bazen düşünüyorum, nasıl oldu da bu kadar harika bir insana denk geldim diye. Hayatımda her şeyin yerli yerinde olmadığını düşündüğüm bir anda karşıma sen çıktın. Ve bir anda, o eksikliğimin kapandığını hissettim. Sen yanımdayken hayat fazlasıyla güzel. Ve biliyor musun, ben seni her geçen gün daha çok seviyorum. Olduğun gibi seviyorum.',
        'Hayat çok garip. Tesadüfi bir an bütün hayatı değiştiriyor. Benim hayatımı değiştiren şey enerjindi. O günden beri hiçbir şey aynı değil. İçim çok huzurlu. Sesin her seferinde huzur dolduruyo, varlığın beni var yapıyor. Hayat zorladığında bile, senin varlığını düşünmek yetiyor güç bulmama. Keşke daha erken tanısaydım seni, ama belki de tam doğru zamanında geldin. İyi ki varsın.',
        'Sabahları uyandığımda aklıma sen geliyorsun. Gülümsemeye başlıyorum, çünkü senin benim olduğuna bazen kendimi inandıramıyorum. En sevdiğim şey oldu senin hayalini kurmak. İleriyi, yarını, belki seninle yaşlanmayı. Belirsizliklerden korkmamak gibi bir şey bu, çünkü seninle olumsuzluklar bile üstünden geçilebilir gibi geliyor. Gelecek bile. En sade anlarımızda bile yüklü anlamlar var, birlikte olduğumuz sürece hiçbir şey sıradan değil. Bazen sadece yanına uzanmak, hiçbir şey demeden durmak istiyorum.',
        'Eskiden böyle güzel bir ilişkiye sahip olmak insana yük bindirir diye düşünüyordum. Aksine bu denli güzel bir ilişki insanın hayatını her açıdan hafifletiyor. Seninle her şeyin üstesinden gelebileceğime inanıyorum, sende aynı şekilde geleceksin. Beraber engellerin üstesinden geleceğiz. Çünkü ikimiz bir elmanın yarısıyız.',
        'Seni o kadar özlüyorum ki, yanımdayken bile özlüyorum. Belki garip ama içimde hep daha fazlasını istiyor kalbim. Daha çok sesini duymak, daha uzun sarılmak. Her defasında biraz daha seviyorum seni. Birlikte olunca, dünya biraz daha sessizleşiyor sanki. Gürültüler azalıyor, kalabalıklar kayboluyor, sadece sen kalıyorsun ve ben. İyi ki varsın. Gerçekten. Bunu okurken bana sarılır mısın?',
        'Bazen seni izlerken içimden bu güzel kız benim için yaratılmış diyorum tabii ki fark etmiyorsun ama, bana olan sevgin, gülüşün, heyecanın beni bulunduğum ortamdan tamamen soyutluyor. Sadece sen ve ben. Bu özel hissetmenin dışında bir his buna eminim, sanki yuvamdaymışım gibi. Yuvamızın olduğu, her sabaha seninle kalktığım her gece de öpücükle seni uyuttuğum günleri hayal etmekten hiç sıkılmıyorum. Gerçekleşeceklerini biliyorum ve bu konuda eminim. Seni gerçekten çok seviyorum.',
        'Genelde senle konuşurken sevgimi tam anlamıyla yansıtamadığımı düşünüyorum ama emin ol ki şuan yazdığım şey bile benim sana olan sevgimin yanında gerçekten bir hiç kalıyor. Fakat gerçekten seni her şeylerden tüm kalbimle tüm varlığımla çok sevdiğimi bilmeni istiyorum. Çünkü sensiz ben var olamazdım.',
        'Hayat bunaltıcı, daraltıcı ve zorlayıcı. Bunu hissettiğin zamanda annen, baban arkadaşların seni anlamasa bile ben her zaman her zaman seni anlıyorum ve her kararında yanındayım . Doğru yanlış burada önemli değil, hayatta yanlış da yapabilirsin ama ben yanlışlarınla da yanında olucam. Hayat hem bunları düşünmek için çok kısa hem de ben seni çok seviyorum.',
        'Seninle tartışmak bile o kadar farklı hissettiriyor ki, evet bol bol tartışabiliriz ama tartışmalar sonrasındaki olgunluğun beni kendine daha da çok çekiyor. Aklına da hayranım, zekana hayranım, güzelliğine hayranım. Ama en çok da kalbine hayranım. Kalbinin güzelliği beni benden alıyor. Her şeyinle çok güzelsin. Bunu bilmeni istiyorum.',
        'Son olarak, sen gerçekten çok zeki bir kızsın ve bunu senin de sonuna kadar inanmanı istiyorum. Potansiyelinin gerçekten çok yukarıda olduğuna inanıyorum ve inanmakla kalmıyorum da, biliyorum. Acaba sana karşı olan sonsuz sevgimden mi böyle hissediyorum ama eminim ki sen hayatındaki tüm sorunları teker teker ezip geçeceksin. Mükemmel bir insansın, ve benim sevgilim olduğun için kendimi çok şanslı hissediyorum. Seni çok çok çok çok çok çooook seviyorum güzel sevgilim benim.'
    ];

    for (let i = 1; i <= TOTAL_PAGES; i++) {
        pagesData.push({
            pageNumber: i,
            imageSrc: `images/${i}.webp`,
            text: i <= providedTexts.length ? providedTexts[i - 1] : null
        });
    }
    // MODIFIED: Gereksiz olan ikinci döngü kaldırıldı.
    // for (let i = pagesData.length + 1; i <= TOTAL_PAGES; i++) {
    //     pagesData.push({ pageNumber: i, imageSrc: null, text: null });
    // }

    // --- Functions ---
    function openNotebook() {
        fixedTitleElem.textContent = coverTitleElem.textContent;
        coverPageDiv.classList.add('hidden');
        notebookInteriorDiv.classList.remove('hidden');
        currentPage = 1;
        renderPage(currentPage);
    }

    function returnToCover() {
        notebookInteriorDiv.classList.add('hidden');
        coverPageDiv.classList.remove('hidden');
        if (imageFocusOverlay && imageFocusOverlay.classList.contains('visible')) {
            hideImageFocus();
        }
    }

    function renderPage(pageNumber) {
        currentPageContentDiv.classList.add('fade-out');
        setTimeout(() => {
            const pageData = pagesData.find(p => p.pageNumber === pageNumber);
            if (pageData) {
                if (pageData.imageSrc) {
                    pageImageElem.src = pageData.imageSrc;
                    pageImageElem.alt = pageData.text ? pageData.text.substring(0, 50) + "..." : `Anı Resmi ${pageData.pageNumber}`;
                    pageImageElem.classList.remove('hidden');
                    pageImageElem.style.cursor = 'pointer';
                } else {
                    pageImageElem.src = '';
                    pageImageElem.classList.add('hidden');
                    pageImageElem.style.cursor = 'default';
                }
                pageTextElem.textContent = pageData.text || '';
            } else {
                pageImageElem.classList.add('hidden');
                pageImageElem.style.cursor = 'default';
                pageTextElem.textContent = 'Sayfa içeriği bulunamadı.';
            }
            updateNavigationButtons();
            currentPageContentDiv.scrollTop = 0;
            currentPageContentDiv.classList.remove('fade-out');
        }, 150);
    }

    function updateNavigationButtons() {
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === TOTAL_PAGES;
    }

    function goToNextPage() {
        if (currentPage < TOTAL_PAGES) {
            currentPage++;
            renderPage(currentPage);
        }
    }

    function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    }

    function showImageFocus() {
        if (pageImageElem.src && !pageImageElem.classList.contains('hidden') && imageFocusOverlay) {
            focusedImageElem.src = pageImageElem.src;
            focusedImageElem.alt = pageImageElem.alt + " (odaklanmış)";
            imageFocusOverlay.classList.add('visible');
            appContainer.classList.add('app-blurred');
        }
    }

    function hideImageFocus() {
        if (imageFocusOverlay) {
            imageFocusOverlay.classList.remove('visible');
            appContainer.classList.remove('app-blurred');
        }
    }

    // --- Event Listeners ---
    openNotebookBtn.addEventListener('click', openNotebook);
    returnToCoverBtn.addEventListener('click', returnToCover);
    prevPageBtn.addEventListener('click', goToPrevPage);
    nextPageBtn.addEventListener('click', goToNextPage);

    pageImageElem.addEventListener('click', () => {
        if (!pageImageElem.classList.contains('hidden') && pageImageElem.getAttribute('src')) {
            showImageFocus();
        }
    });

    // --- Initial Setup ---
    setupImageFocusElements();
});