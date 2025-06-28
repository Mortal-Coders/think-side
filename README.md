Think Side
---

# 🛠️ Yazılım Geliştirme Öncesi Teknik Doküman

**Thin Side:** Fikir Karşılaştırma Uygulaması (Pros & Cons Tool)
**Amaç:** Bir konu/fikir hakkında artı–eksi veya benzeri zıt kutuplardaki düşünceleri görsel ve metinsel olarak organize etmek ve paylaşılabilir hale getirmek.

---

## 🎯 Proje Amacı

Kullanıcılar bir konu/fikir girip, bu konu hakkında:

* İki zıt sütun halinde düşünceler yazabilir (örn: Olmalı / Olmamalı),
* Bu sayfayı arkadaşlarıyla paylaşabilir,
* Arkadaşları da yeni maddeler ekleyebilir ancak mevcut verileri silemez,
* Sadece fikir sahibinin erişebileceği özel bir **silme kodu** aracılığıyla fikir tamamen kaldırılabilir.

---

## 🧱 Temel Özellikler

| Özellik                                  | Açıklama                                                                      |
| ---------------------------------------- | ----------------------------------------------------------------------------- |
| ✅ Fikir oluşturma                        | Başlık, iki sütun başlığı, girişler                                           |
| ✅ Artı/Eksi veya farklı kategori türleri | Kullanıcı hazır şablonlardan seçim yapabilir veya kendi başlıklarını tanımlar |
| ✅ Paylaşılabilir link                    | Kısa ID üzerinden herkese açık görüntüleme                                    |
| ✅ Katkı                                  | Herkes yeni madde ekleyebilir                                                 |
| ✅ Silme kodu                             | Sadece fikir sahibi silebilir (kod gerektirir)                                |
| ❌ Silme yetkisi yok                      | Katkıda bulunanlar mevcut veriyi silemez                                      |

---

## 🧩 Kategori (Şablon) Yapısı

Sabit şablonlar + kullanıcı tanımlı başlık desteği:

### Örnek Şablonlar:

| ID                | Sol Başlık  | Sağ Başlık    |
| ----------------- | ----------- | ------------- |
| pro-con           | Artı        | Eksi          |
| must-shouldnt     | Olmalı      | Olmamalı      |
| opportunity-risk  | Fırsat      | Risk          |
| strength-weakness | Güçlü Yön   | Zayıf Yön     |
| support-oppose    | Destekleyen | Karşı Argüman |

### Serbest Etiket:

* Kullanıcı kendi başlıklarını tanımlayabilir: Örn. `["Neden Yapılmalı", "Neden Yapılmamalı"]`

---

## 🧠 Veri Modeli (Go Struct)

```go
type Idea struct {
    ID          string   // Benzersiz kısa ID (base62)
    Title       string   // Konu başlığı
    LeftLabel   string   // Sol sütun başlığı
    RightLabel  string   // Sağ sütun başlığı
    LeftItems   []string // Sol içerikler
    RightItems  []string // Sağ içerikler
    DeleteCode  string   // Sadece sahibi için silme yetkisi
    CreatedAt   time.Time
}
```

---

## 🗃️ Veritabanı: PostgreSQL

```sql
CREATE TABLE ideas (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    left_label TEXT NOT NULL,
    right_label TEXT NOT NULL,
    left_items TEXT[],
    right_items TEXT[],
    delete_code TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

> `TEXT[]` kullanımı ilk versiyon için yeterli. Gelişmiş sürümde `items` ayrı tabloya alınabilir.

---

## 🔑 ID ve Silme Kodu Üretimi

* `ID`: Rastgele, kısa, base62 formatında (`generateID(10)`)
* `DeleteCode`: Benzer şekilde, `generateID(8)` ile üretilir ve sadece oluşturulurken gösterilir
* Her iki değer de `crypto/rand` tabanlı olmalı

---

## 🌐 HTTP API Endpoint'leri

| Metod    | Yol                            | Açıklama                             |
| -------- | ------------------------------ | ------------------------------------ |
| `POST`   | `/idea`                        | Yeni fikir oluşturma                 |
| `GET`    | `/idea/{id}`                   | Fikri gösterme (görsel + veri)       |
| `POST`   | `/idea/{id}/left`              | Sol sütuna yeni madde ekleme         |
| `POST`   | `/idea/{id}/right`             | Sağ sütuna yeni madde ekleme         |
| `DELETE` | `/idea/{id}?code={deleteCode}` | Fikri silme (kodla yetkilendirilmiş) |

---

## 🖼️ Arayüz (Frontend) Özellikleri

* Minimal tek sayfa uygulama
* Responsive HTML + CSS
* JavaScript ile:

  * Form gönderimi (fetch API)
  * Yeni satır ekleme
  * Başlıklar dinamik gösterilir (şablonlara göre)
* Başlık + liste görünümü:

```
+----------------------------+
|        Başlık             |
+--------+------------------+
| Sol    | Sağ              |
|--------|------------------|
| madde1 | madde1           |
| madde2 | madde2           |
+--------+------------------+
```

---

## 🐳 Docker ve Dağıtım

* Go ile build → tek binary
* `embed` ile HTML/CSS/JS binary'e gömülür
* PostgreSQL dış servis (Docker Compose önerilir)
* Docker image `FROM scratch` veya `alpine` ile minimize edilir

---

## 🚧 Geliştirme Aşamaları

1. [x] Temel veri modeli ve struct tanımı
2. [x] Kısa ID üretimi (Go)
3. [x] PostgreSQL şeması
4. [ ] Temel CRUD API’leri
5. [ ] Frontend (tek sayfa HTML)
6. [ ] Silme kodu yönetimi
7. [ ] Dockerfile + deploy

---
