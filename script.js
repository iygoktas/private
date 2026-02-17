document.addEventListener('DOMContentLoaded', () => {
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
    const pageImageContainer = document.querySelector('.page-image-container');

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
        'Sen gerçekten çok zeki bir kadınsın ve hiçbir zaman bundan şüphe etmeni istemiyorum. Potansiyelinin gerçekten çok yukarıda olduğuna inanıyorum ve inanmakla kalmıyorum da, biliyorum. Acaba sana karşı olan sonsuz sevgimden mi böyle hissediyorum bilmiyorum ama eminim ki sen hayatındaki tüm sorunları teker teker ezip geçeceksin. Mükemmel bir insansın, ve benim sevgilim olduğun için kendimi çok şanslı hissediyorum. Seni çok çok çok çok çok çooook seviyorum güzel sevgilim benim.',
        'Nasılsın güzelim. Seninle beraber bu hayat yolunda yürümeyi tüm kalbimle çok ama çok seviyorum. Eminim ki kötü günler olacak ve oldu da ama hepsini çekilebilir ve sonuna kadar uğraşıp emek vermeye değer kılan senin güzel kalbin ve kişiliğin oldu. Motivasyonunu buradan aldığını söylemiştin, ben hayatımın motivasyonunu, zevkini ve kalan her şeyini senden alıyorum. Sensiz hayat düşünemiyorum bile, düşünmek istemiyorum ve bilmek de istemiyorum . Güzelim, ben sana çok aşığım. Bunlar ışığında, dışarıdan belki güçlü bir karakter olarak da görünüyor olabilirim fakat bunun sebebi sensin be aşkım sensin, sensiz ne yapardım ben. Kendimi ne kadar yalnız hissederdim tahmin etmek istemiyorum. ',
        'Bu siteyi ilk başta kodlarken bu kadar yol katedeceğimizi ve beraber böyle güzel anılar biriktireceğimizi tahmin etmemiştim biliyor musun. Bunları yazarken sen uyuyorsun şuan, benimle olduğunu bilmek ve benimle olurken mutlu bir şekilde uyuduğunu bilmek beni çok mutlu ediyor. Bu genelleme hariç hiçbir erkek genellemesini kabul etmiyorum: Erkek adam çok ama çok sever. Buna o kadar inanıyorum ki. Ben sadece çok ama çok seven bir erkek de değilim, ben seni çok ama çok seven bir erkeğim, sana çok saygılı, aşık, seninle gelecek hayali kuran bir erkeğim. Ayrıca, alakasız ama içimden geldi: Yaptığım tüm iyi/kötü esprilerime hep güzel dişlerinle güldüğün için teşekkür ederim güzel bebeğim.',
        'Bundan önce yazdığım yazılar ne kadar farklıymış şimdiye göre, buradan da görebiliyorum beraber büyümüşüz, olgunlaşmışız. Bunu beraber yaptığımız için çok mutluyum. Daha nice günler bizi bekliyor, beraber aynı evde kaldığımız, birbirimizi üzmekten çok çekindiğimiz, saygının sevginin en önemli şeyler olduğu bir evde seni benimle hayal ediyorum ve bunun için söz veriyorum çok çabalayacağım. ',
        'Bunun hakkında burada önceden bahsettim ama tekrardan bahsetmek istiyorum. Sevgilim, sen gerçekten ama gerçekten çok akıllı, çok zeki ve çok olgun bir kızsın. Gelecek hayatın için kaygılanma, ben bunu kendim çok iyi biliyorum ve hissediyorum ki bu dünyadaki en mutlu insanlardan biri olacaksın, biri diyorum çünkü seninle olduğum için en mutlu insan ben olacağım. Sakın aklına ve kalbine uyan karakter özelliklerinden şaşma olur mu? Kimse için bunu yapma. Sen hiçkimsede görmediğim şeylere sahipsin güzelim benim. Sevgilim dışında insan olarak bir kere çok güzel bir insansın, çok temiz kalpli bir insansın. Seni sevgilim yapabildiğim için çok gurur duyuyorum kendimle.',
        'Benim mutluluğumu ilişkimiz boyunca ne kadar arttırdığını görmen için anlatmama gerek yok. Bu sitenin en başına git ve fotoğrafların hepsine teker teker bak. Sonrasında da bu yeni eklediğim resimlere teker teker bir göz at. Sen beni gerçekten pozitif anlamda o kadar çok değiştirdin ki. Bana hem çok şey öğrettin hemde dünyanın aslında seninle birlikte gülünce ne kadar da mutlu yaşanılabildiğini öğrettin. İyi ki varsın be hayatım, hep de yanımda ol olur mu? Seni kırıp üzdüğüm zamanlar için özür dilerim, emin ol ki böyle şeylerin yaşanmaması için elimden ne geliyorsa yapmaya hazırım. Benim elimde olan şeyleri düşünme bile, çünkü artık öyle şeyler olmayacak.',
        'Son olarak güzelim, her şey için teşekkür ederim. Bana gösterdiğin sevgiyi, saygıyı ve emeği sonuna kadar görüyorum. Benim üzerimde durduğun ve sevginle kızıp tartıştığın için teşekkür ederim. Çünkü aynı dediğin gibi, çok sevdiğin için üzülüyorsun, çok sevdiğin için yıkılıyorsun. Bende seni çoooooooook seviyorummmm. Canını sıkan diğer insanları boşver olur mu, ben hep senin yanındayım, cevap veremesem bile en azından seni dinlerim, çözüm üretmeye çalışırım. İyi ki varsın. Yeni sayfaya geç :)'
    ];

    const imageFiles = [
        '1.webp',
        '2.webp',
        '3.webp',
        '4.webp',
        '5.webp',
        '6.webp',
        '7.webp',
        '8.webp',
        '9.webp',
        '10.webp',
        '11.webp',
        '12.webp',
        '13.webp',
        '14.webp',
        '15.webp',
        '16.webp'
    ];

    const QUESTION_PAGE_NUMBER = imageFiles.length + 1;
    const TOTAL_PAGES = Math.max(providedTexts.length, QUESTION_PAGE_NUMBER);

    for (let i = 1; i <= TOTAL_PAGES; i++) {
        const isQuestionPage = i === QUESTION_PAGE_NUMBER;
        pagesData.push({
            pageNumber: i,
            imageSrc: !isQuestionPage && i <= imageFiles.length ? `images/${imageFiles[i - 1]}` : null,
            text: isQuestionPage ? '' : (providedTexts[i - 1] || ''),
            isQuestionPage
        });
    }
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
                if (pageData.isQuestionPage) {
                    if (pageImageContainer) {
                        pageImageContainer.classList.add('hidden');
                    }
                    renderLoveQuestion();
                } else {
                    if (pageImageContainer) {
                        pageImageContainer.classList.remove('hidden');
                    }
                    pageTextElem.classList.remove('love-question-active');
                    pageTextElem.textContent = pageData.text || '';
                }
            } else {
                pageImageElem.classList.add('hidden');
                pageImageElem.style.cursor = 'default';
                pageTextElem.classList.remove('love-question-active');
                pageTextElem.textContent = 'Sayfa içeriği bulunamadı.';
            }
            updateNavigationButtons();
            currentPageContentDiv.scrollTop = 0;
            currentPageContentDiv.classList.remove('fade-out');
        }, 150);
    }

    function renderLoveQuestion() {
        pageTextElem.classList.add('love-question-active');
        pageTextElem.innerHTML = `
            <div class="love-question">
                <div class="love-confetti" aria-hidden="true"></div>
                <div class="love-hearts" aria-hidden="true"></div>
                <p class="love-question-title">Beni seviyor musun?</p>
                <p class="love-question-sub" id="love-question-sub">Cevabın çok önemli.</p>
                <div class="love-question-actions">
                    <button id="love-yes-btn" class="love-yes">Evet</button>
                    <button id="love-no-btn" class="love-no">Hayır</button>
                </div>
            </div>
        `;

        const loveSub = document.getElementById('love-question-sub');
        const loveYes = document.getElementById('love-yes-btn');
        const loveNo = document.getElementById('love-no-btn');
        const heartsContainer = pageTextElem.querySelector('.love-hearts');
        const confettiContainer = pageTextElem.querySelector('.love-confetti');

        const noReplies = [
            'Emin misin aşkım?',
            'Son kararın mı :(',
            'Kalbim kırılacak ama yine de mi?',
            'Bir kez daha düşünsen olmaz mı?',
            'Şaka olarak algıladım hadi hadi.',
            'Sadece “Evet” demen yeter aslında.',
            'Son şansın, sevmiyor musun beni?',
            'Tamam, bir kez daha soruyorum: Beni seviyor musun?',
            'İnatçısın ama ben daha inatçıyım.',
            'Peki ya minik bir “evet”?'
        ];

        let noIndex = 0;
        let accepted = false;

        loveYes.addEventListener('click', () => {
            if (!accepted) {
                accepted = true;
                loveSub.textContent = 'Ben de seni çoooook seviyorum güzelimmmm. İyi ki varsın.';
                loveYes.textContent = 'Yeeeyy!';
                loveNo.style.display = 'none';
                launchHearts(heartsContainer);
            }
            launchConfetti(confettiContainer);
        });

        loveNo.addEventListener('click', () => {
            const nextText = noReplies[Math.min(noIndex, noReplies.length - 1)];
            loveSub.textContent = nextText;
            loveNo.textContent = noIndex < 2 ? 'Hayır' : 'Emin misin?';
            loveYes.textContent = noIndex < 3 ? 'Evet' : 'Evet, tabii';
            noIndex += 1;

            if (noIndex >= noReplies.length) {
                loveNo.style.display = 'none';
                loveYes.textContent = 'Evet';
            }
        });
    }

    function launchHearts(container) {
        if (!container) return;
        container.innerHTML = '';
        const heartCount = 40;
        for (let i = 0; i < heartCount; i += 1) {
            const heart = document.createElement('span');
            heart.className = 'love-heart';
            const x = Math.random() * 100;
            const delay = Math.random() * 0.9;
            const duration = 1.6 + Math.random() * 1.4;
            const scale = 0.7 + Math.random() * 1.0;
            heart.style.left = `${x}%`;
            heart.style.animationDelay = `${delay}s`;
            heart.style.animationDuration = `${duration}s`;
            heart.style.setProperty('--scale', scale.toFixed(2));
            container.appendChild(heart);
        }
    }

    function launchConfetti(container) {
        if (!container) return;
        container.innerHTML = '';
        const colors = ['#f2a7c6', '#f6d365', '#7fd1c5', '#a3bff0', '#f39a7b', '#caa0f0'];
        const pieceCount = 50;
        for (let i = 0; i < pieceCount; i += 1) {
            const piece = document.createElement('span');
            piece.className = 'confetti-piece';
            const x = Math.random() * 100;
            const delay = Math.random() * 0.4;
            const duration = 1.6 + Math.random() * 1.2;
            const rotation = Math.floor(Math.random() * 360);
            const color = colors[i % colors.length];
            piece.style.left = `${x}%`;
            piece.style.animationDelay = `${delay}s`;
            piece.style.animationDuration = `${duration}s`;
            piece.style.setProperty('--spin', `${rotation}deg`);
            piece.style.background = color;
            container.appendChild(piece);
        }
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
