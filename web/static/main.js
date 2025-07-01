document.addEventListener('DOMContentLoaded', function() {
    // Elemanları seç
    const setupSection = document.getElementById('setupSection');
    const comparisonSection = document.getElementById('comparisonSection');
    const setupForm = document.getElementById('setupForm');
    const categoryButtons = document.querySelectorAll('.category-chip:not(#addCustomCategoryBtn)');
    const selectedCategoryInput = document.getElementById('selectedCategory');
    const topicInput = document.getElementById('topicInput');
    const addCustomCategoryBtn = document.getElementById('addCustomCategoryBtn');
    const customCategoryModal = document.getElementById('customCategoryModal');
    const cancelCustomCategoryBtn = document.getElementById('cancelCustomCategoryBtn');
    const customCategoryForm = document.getElementById('customCategoryForm');
    const categoryContainer = document.getElementById('categoryContainer');

    // Karşılaştırma elemanları
    const displayTopic = document.getElementById('displayTopic');
    const displayCategory = document.getElementById('displayCategory');
    const leftTitle = document.getElementById('leftTitle');
    const rightTitle = document.getElementById('rightTitle');
    const leftList = document.getElementById('leftList');
    const rightList = document.getElementById('rightList');
    const leftInput = document.getElementById('leftInput');
    const rightInput = document.getElementById('rightInput');
    const addLeftBtn = document.getElementById('addLeftBtn');
    const addRightBtn = document.getElementById('addRightBtn');
    const newComparisonBtn = document.getElementById('newComparisonBtn');
    const leftCount = document.getElementById('leftCount');
    const rightCount = document.getElementById('rightCount');
    const leftCountLabel = document.getElementById('leftCountLabel');
    const rightCountLabel = document.getElementById('rightCountLabel');

    let currentData = {
        id: '',
        topic: '',
        category: '',
        leftLabel: '',
        rightLabel: '',
        categoryId: '',
        leftItems: [],
        rightItems: []
    };

    // Sayfa yüklendiğinde mevcut maddeleri currentData'ya aktar
    function initializeCurrentDataFromDOM() {
        // Sol liste
        currentData.leftItems = [];
        leftList.querySelectorAll('li span.flex-1').forEach(span => {
            currentData.leftItems.push(span.textContent.trim());
        });
        // Sağ liste
        currentData.rightItems = [];
        rightList.querySelectorAll('li span.flex-1').forEach(span => {
            currentData.rightItems.push(span.textContent.trim());
        });
        updateCounts();
    }
    initializeCurrentDataFromDOM();

        function addProps(side) {

            let id = document.getElementById('ideaId').value;
            let content = side
                ? currentData.leftItems[currentData.leftItems.length-1]
                : currentData.rightItems[currentData.rightItems.length-1];

            const  postData = {
                content: content,
                ideaId: id,
                isPro: side
            }

            fetch(`/ideas/${id}/prop`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Başarılı:', data);
                })
                .catch(error => {
                    console.error('Hata:', error);
                });

        }

    // Kategori butonları için event listener
    function setupCategoryButton(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Tüm butonlardan active ve koyu renk classlarını kaldır
            const chips = categoryContainer.querySelectorAll('.category-chip:not(#addCustomCategoryBtn)');
            chips.forEach((btn, i) => {
                btn.classList.remove('active', 'bg-sky-700', 'bg-cyan-700', 'bg-emerald-700', 'bg-purple-700', 'bg-pink-700');
            });
            // Seçilen butona active ve ilgili koyu arka plan class'ını ekle
            this.classList.add('active');
            // Renk seti indexini bul
            const chipsArr = Array.from(chips);
            const idx = chipsArr.indexOf(this);
            const darkBgClasses = [
                'bg-sky-700',
                'bg-cyan-700',
                'bg-emerald-700',
                'bg-purple-700',
                'bg-pink-700'
            ];
            if (idx !== -1) {
                this.classList.add(darkBgClasses[idx % darkBgClasses.length]);
            }
            selectedCategoryInput.value = this.dataset.category;
        });
    }

    // Mevcut butonları ayarla
    categoryButtons.forEach(setupCategoryButton);

    // Özel kategori ekleme butonu
    addCustomCategoryBtn.addEventListener('click', () => {
    customCategoryModal.classList.remove('hidden');
});

    // Modal iptal butonu
    cancelCustomCategoryBtn.addEventListener('click', () => {
    customCategoryModal.classList.add('hidden');
});

    // Özel kategori formu
    customCategoryForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const categoryName = document.getElementById('customCategoryName').value.trim();
        const leftLabel = document.getElementById('customLeftLabel').value.trim();
        const rightLabel = document.getElementById('customRightLabel').value.trim();

        if (!categoryName || !leftLabel || !rightLabel) return;

        // Önce /categories endpointine istek at
        let categoryId = '';
        try {
            const response = await fetch('/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: categoryName,
                    leftLabel: leftLabel,
                    rightLabel: rightLabel
                })
            });
            if (response.ok) {
                const data = await response.json();
                categoryId = data.id || data.ID || '';
            }
        } catch (err) {
            console.error('Kategori eklenirken hata:', err);
        }

        // Yeni buton oluştur
        const newButton = document.createElement('button');
        newButton.type = 'button';
        newButton.className = 'category-chip bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200';
        newButton.dataset.category = categoryName.toLowerCase().replace(/ /g, '-');
        newButton.dataset.left = leftLabel;
        newButton.dataset.right = rightLabel;
        if (categoryId) newButton.dataset.id = categoryId;
        newButton.innerHTML = `<i class="fas fa-star mr-1"></i>${categoryName}`;

        // Buton işlevselliği ekle
        setupCategoryButton(newButton);

        // Kapsayıcıya ekle (özel butonun önüne)
        categoryContainer.insertBefore(newButton, addCustomCategoryBtn);

        // Modal'ı kapat ve formu temizle
        customCategoryModal.classList.add('hidden');
        customCategoryForm.reset();

        // Yeni butonu hemen seç
        newButton.click();
});

    // Form submit
    setupForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const topic = topicInput.value.trim();
    const category = selectedCategoryInput.value;

    if (!topic || !category) {
    alert('Lütfen konu başlığı girin ve bir kategori seçin.');
    return;
}

    // Seçilen kategori butonunu bul
    const selectedButton = document.querySelector(`[data-category="${category}"]`);
    if (!selectedButton) return;

    // Verileri kaydet
    currentData.topic = topic;
    currentData.category = category;
    currentData.leftLabel = selectedButton.dataset.left;
    currentData.rightLabel = selectedButton.dataset.right;
    currentData.categoryId = selectedButton.dataset.id;
    currentData.leftItems = [];
    currentData.rightItems = [];

    const postData = {
        title: currentData.topic,
        categoryId: currentData.categoryId
    }

    fetch('/ideas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Başarılı:', data);
            currentData.id = data.ID;
            window.location.href = `/${data.ID}`
        })
        .catch(error => {
            console.error('Hata:', error);
        });

    // Karşılaştırma bölümünü göster
    showComparison();
});

    // Karşılaştırma bölümünü göster
    function showComparison() {
    setupSection.classList.add('hidden');
    comparisonSection.classList.remove('hidden');

    displayTopic.textContent = currentData.topic;
    displayCategory.textContent = `${currentData.leftLabel} / ${currentData.rightLabel}`;
    leftTitle.textContent = currentData.leftLabel;
    rightTitle.textContent = currentData.rightLabel;
    leftCountLabel.textContent = currentData.leftLabel;
    rightCountLabel.textContent = currentData.rightLabel;

    updateLists();
    updateCounts();
}

    // Madde ekleme
    addLeftBtn.addEventListener('click', function() {
    const text = leftInput.value.trim();
    if (text) {
    currentData.leftItems.push(text);
    leftInput.value = '';
    updateLists();
    updateCounts();
    addProps(true);
}
});

    addRightBtn.addEventListener('click', function() {
    const text = rightInput.value.trim();
    if (text) {
    currentData.rightItems.push(text);
    rightInput.value = '';
    updateLists();
    updateCounts();
    addProps(false);
}
});

    // Enter tuşu ile madde ekleme
    leftInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
    addLeftBtn.click();
}
});

    rightInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
    addRightBtn.click();
}
});

    // Listeleri güncelle
    function updateLists() {
        // Sol liste
        leftList.innerHTML = '';
        currentData.leftItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex justify-between items-center';
            li.innerHTML = `
                <span class="flex-1">${item}</span>
            `;
            leftList.appendChild(li);
        });

        // Sağ liste
        rightList.innerHTML = '';
        currentData.rightItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'bg-rose-50 border border-rose-200 p-3 rounded-lg flex justify-between items-center';
            li.innerHTML = `
                <span class="flex-1">${item}</span>
            `;
            rightList.appendChild(li);
        });
    }

    // Sayaçları güncelle
    function updateCounts() {
    leftCount.textContent = currentData.leftItems.length;
    rightCount.textContent = currentData.rightItems.length;
}

    // Madde silme fonksiyonları (global)
    window.removeLeftItem = function(index) {
    currentData.leftItems.splice(index, 1);
    updateLists();
    updateCounts();
};

    window.removeRightItem = function(index) {
    currentData.rightItems.splice(index, 1);
    updateLists();
    updateCounts();
};

    // Yeni karşılaştırma
    newComparisonBtn.addEventListener('click', function() {
    setupSection.classList.remove('hidden');
    comparisonSection.classList.add('hidden');

    // Formu temizle
    topicInput.value = '';
    selectedCategoryInput.value = '';

    // Kategori butonlarını sıfırla
    document.querySelectorAll('.category-chip').forEach(btn => {
    btn.classList.remove('active', 'bg-sky-700', 'bg-cyan-700', 'bg-emerald-700', 'bg-purple-700');
    const bgClass = btn.dataset.category === 'arti/eksi' ? 'bg-sky-600' :
    btn.dataset.category === 'olmali/olmamalı' ? 'bg-cyan-600' :
    btn.dataset.category === 'avantaj/dezavantaj' ? 'bg-emerald-600' :
    btn.id === 'addCustomCategoryBtn' ? 'bg-gray-200' :
    'bg-purple-600';
    btn.classList.add(bgClass);
});

    // Verileri sıfırla
    currentData = {
    topic: '',
    category: '',
    leftLabel: '',
    rightLabel: '',
    leftItems: [],
    rightItems: []
};
});
});

// Kategori chip renk ve ikonlarını güncelleyen fonksiyon
function updateCategoryChips() {
    const colorSets = [
        ['bg-sky-600', 'hover:bg-sky-700'],
        ['bg-cyan-600', 'hover:bg-cyan-700'],
        ['bg-emerald-600', 'hover:bg-emerald-700'],
        ['bg-purple-600', 'hover:bg-purple-700'],
        ['bg-pink-600', 'hover:bg-pink-700'],
        ['bg-orange-500', 'hover:bg-orange-600'],
        ['bg-yellow-500', 'hover:bg-yellow-600'],
        ['bg-lime-600', 'hover:bg-lime-700'],
        ['bg-teal-600', 'hover:bg-teal-700'],
        ['bg-indigo-600', 'hover:bg-indigo-700'],
        ['bg-fuchsia-600', 'hover:bg-fuchsia-700'],
        ['bg-red-600', 'hover:bg-red-700']
    ];
    const iconClasses = [
        'fa-balance-scale-left',
        'fa-check-circle',
        'fa-chart-line',
        'fa-star',
        'fa-lightbulb',
        'fa-fire',
        'fa-leaf',
        'fa-heart',
        'fa-moon',
        'fa-sun',
        'fa-rocket',
        'fa-gem'
    ];
    const chips = document.querySelectorAll('#categoryContainer .category-chip:not(#addCustomCategoryBtn)');
    chips.forEach(function(btn, i) {
        // Tüm eski renk classlarını temizle
        colorSets.flat().forEach(c => btn.classList.remove(c));
        // Yeni renk classlarını ekle
        const colorIndex = i % colorSets.length;
        btn.classList.add(...colorSets[colorIndex]);
        // İkonu güncelle
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = 'fas ' + iconClasses[colorIndex % iconClasses.length] + ' mr-1';
        }
    });
}

// Sayfa yüklenince ve yeni kategori eklenince çalıştır
updateCategoryChips();
// MutationObserver ile yeni kategori eklenmesini izle
const observer = new MutationObserver(function(mutationsList) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            updateCategoryChips();
        }
    }
});
observer.observe(categoryContainer, { childList: true });

// Paylaş butonu fonksiyonu
function setupShareButton() {
    const shareBtn = document.getElementById('shareBtn');
    const shareCopiedMsg = document.getElementById('shareCopiedMsg');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(window.location.href).then(function() {
                    if (shareCopiedMsg) {
                        shareCopiedMsg.classList.remove('hidden');
                        setTimeout(() => shareCopiedMsg.classList.add('hidden'), 1500);
                    }
                }).catch(function(err) {
                    alert('Kopyalama başarısız: ' + err);
                });
            } else {
                // Fallback: eski tarayıcılar için
                const tempInput = document.createElement('input');
                tempInput.value = window.location.href;
                document.body.appendChild(tempInput);
                tempInput.select();
                try {
                    document.execCommand('copy');
                    if (shareCopiedMsg) {
                        shareCopiedMsg.classList.remove('hidden');
                        setTimeout(() => shareCopiedMsg.classList.add('hidden'), 1500);
                    }
                } catch (err) {
                    alert('Kopyalama başarısız: ' + err);
                }
                document.body.removeChild(tempInput);
            }
        });
    }
}


