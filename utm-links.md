# 福亨攝影 FU HENG — UTM 追蹤連結

UTM 參數讓 Google Analytics 4（GA4）知道訪客「從哪個管道來」。

> ⚠️ 重要觀念（決定數據是否有用）
> - **導入連結 (Inbound)**：貼在 IG bio、FB 簡介、LINE 等，**指向 `fuheng-studio.com`** 的連結。訪客點進官網時，GA4 會記錄來源 → **這是最重要、真正會進報表的。**
> - **站內社群按鈕 (Outbound)**：官網上「連到社群」的按鈕加 UTM，只是把參數帶到對方平台（LINE / Messenger 會忽略），**不會在 GA4 產生報表**。官網上的社群點擊已由 GTM 事件（`click_line`、`click_messenger`…）追蹤。

---

## 1. 導入連結 Inbound（貼在各平台 → 指向官網）★ 建議優先使用

| 貼在哪裡 | 連結 |
|---|---|
| Instagram bio | `https://fuheng-studio.com/?utm_source=instagram&utm_medium=social&utm_campaign=bio` |
| Facebook 粉專簡介 | `https://fuheng-studio.com/?utm_source=facebook&utm_medium=social&utm_campaign=profile` |
| LINE 官方帳號（簡介／圖文選單） | `https://fuheng-studio.com/?utm_source=line&utm_medium=social&utm_campaign=profile` |
| Threads 簡介 | `https://fuheng-studio.com/?utm_source=threads&utm_medium=social&utm_campaign=bio` |
| FB / IG 一般貼文 | `https://fuheng-studio.com/?utm_source=facebook&utm_medium=social&utm_campaign=post` |
| LINE 群發訊息 | `https://fuheng-studio.com/?utm_source=line&utm_medium=message&utm_campaign=broadcast` |
| Email 簽名檔 | `https://fuheng-studio.com/?utm_source=email&utm_medium=email&utm_campaign=signature` |
| Google 商家檔案 (GBP) | `https://fuheng-studio.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp` |

### 方便複製的版本

**Instagram bio**
```
https://fuheng-studio.com/?utm_source=instagram&utm_medium=social&utm_campaign=bio
```

**Facebook 粉專簡介**
```
https://fuheng-studio.com/?utm_source=facebook&utm_medium=social&utm_campaign=profile
```

**LINE 官方帳號**
```
https://fuheng-studio.com/?utm_source=line&utm_medium=social&utm_campaign=profile
```

**Threads 簡介**
```
https://fuheng-studio.com/?utm_source=threads&utm_medium=social&utm_campaign=bio
```

---

## 2. 官網社群按鈕 Outbound（已套用於 index.html → 連到社群）

| 連結 | 網址 |
|---|---|
| 官方 LINE | `https://lin.ee/OShebzd?utm_source=line&utm_medium=social&utm_campaign=website` |
| Facebook Messenger | `https://m.me/fuhengstudio?utm_source=facebook&utm_medium=social&utm_campaign=website` |
| Facebook 粉專 | `https://www.facebook.com/fuhengstudio?utm_source=facebook&utm_medium=social&utm_campaign=website` |
| Instagram | `https://www.instagram.com/fuheng_studio?utm_source=instagram&utm_medium=social&utm_campaign=website` |
| Threads | `https://www.threads.net/@fuheng_studio?utm_source=threads&utm_medium=social&utm_campaign=website` |

---

## UTM 參數說明

| 參數 | 意義 | 常用值 |
|---|---|---|
| `utm_source` | 來源平台 | `instagram` / `facebook` / `line` / `threads` / `google` / `email` |
| `utm_medium` | 媒介 | `social` / `message` / `email` / `organic` |
| `utm_campaign` | 活動名稱 | `bio` / `profile` / `post` / `broadcast` / `website` / `signature` / `gbp` |

> 命名小提醒：source / medium / campaign 全部用**小寫**並保持一致（GA4 會區分大小寫，`Instagram` 與 `instagram` 會被算成兩個來源）。

## 在 GA4 查看成效

報表 → **客戶開發 (Acquisition)** → **流量開發**，
維度切換到「**工作階段來源/媒介**」或「**工作階段廣告活動**」即可看到各 UTM 帶來的流量與轉換。
