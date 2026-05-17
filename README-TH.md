# GitHub Trend Dashboard

> 🇺🇸 [Read in English](./README.md)

## 🔗 Links

- 📐 **Figma Design:** [Click Here](https://www.figma.com/design/cjKSGwavIBmz3hxJhCrqfD/Github-Trend-Dashboard?node-id=0-1&t=ANd0XHOR974VKZIW-1)
- 📝 **Planning & Research (Notion):** [Click Here](https://rawwalnut.notion.site/Github-Trend-Dashboard-3619a10bbb3a8038accbcf255b77ebcc?source=copy_link)
- 🧪 **API Testing (Bruno):** [Click Here](./bruno)

## 🛠 Tech Stack

| หมวด | เทคโนโลยี |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| API Client | Octokit (GitHub REST API) |
| Icons | Lucide React |

---

## 🚀 วิธีติดตั้งและรัน

### สิ่งที่ต้องมี

- Node.js 18+
- GitHub Personal Access Token ([สร้างที่นี่](https://github.com/settings/tokens))

### ติดตั้ง

```bash
# 1. Clone โปรเจกต์
git clone https://github.com/NutNaphop/github-trend-dashboard.git
cd github-trend-dashboard

# 2. ติดตั้ง dependencies
npm install

# 3. สร้างไฟล์ environment
cp .env.example .env.local
```

### ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` แล้วใส่ GitHub token:

```env
GITHUB_TOKEN=your_github_personal_access_token
```

### รัน

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) เพื่อดู Dashboard

---

## 🧠 Product Thinking

### Design สำหรับใคร?

สำหรับ Developer และ ผู้ที่สนใจในวงการการพัฒนาโปรแกรม เพื่อดู Trending

ดังนั้นแล้วการ Design จะให้ความคุ้นเคยกับ Platform Github เพื่อลด Cognitive load และใช้เวลาทำความเข้าใจได้ในระยะเวลาสั้นๆ โดย

- ลด UI ที่ไม่จำเป็นออก
- ออกแบบ UI ให้มีความเหมือน GITHUB
- โดย Design แบบ Mobile First เพื่อประหยัดเวลาในการทำงาน

### วัด Top กับ Trending ยังไง

#### การกำหนด Top Programing

เรากำหนดด้วย star โดยเรียงลำดับจาก star มากไปน้อยใน 100 รายการแรก เพราะหาก 1000 รายการอาจจะยังไม่เหมาะ เพราะต้องยิง API ทั้งหมด 10 ครั้งต่อผู้ใช้ถึงแม้จะ cache ก็รับได้มากสุดแค่ 3 คนใน 1 นาที มันจะติด limit แน่นอน แต่ถ้าหากเลือก 100 รายการแรก แปลว่า ใน 1 นาทีเราสามารถรับได้ ประมาณ 29-30 คน

สาเหตุเป็นเพราะ star สื่อถึงความน่าสนใจและน่าติดตาม ร่วมกับ การที่เป็น repo ระดับท็อปแสดงให้เห็นถึงคุณภาพและความนิยมตลอดกาล

แต่ปัญหาจะอยู่ที่ว่าบาง Top Repo นั้นไม่ใช่ภาษา เราจะทำการกรองออกกรณีที่ไม่มีภาษาหลักกำหนดเพื่อเอาข้อมูลขยะออกไปให้ได้มากที่สุดจากนั้น count ทีละภาษาและแสดงผลออกมาในรูปแบบ Donut Chart 10 ตัวแรก

สาเหตุที่เลือก กราฟโดนัท เพราะว่าการนำเสนอข้อมูลควรนำเสนอออกมาให้ดูได้ง่ายมากที่สุด และ Top Programing ส่วนตัวคิดว่าหากคิดจากสัดส่วน 100% กราฟดังกล่าวสามารถเห็นภาพรวมได้ง่ายมากกว่า

กรองเริ่มจาก query ก่อนด้วย

- เอาที่ fork มาออกไป
- เอา archived ออกไป
- ลบ topic พวก book list awesome list ออก
- ดึง 100 รายการแรก
- sort ด้วย star เรียงจากมากไปน้อย

```
GET /search/repositories?q=stars:>1000 fork:false archived:false -topic:awesome -topic:list -topic:books&per_page=100&sort=stars&order=desc
```

#### การกำหนด Top Repository

กำหนดด้วย Star เช่นกันและ sort star จากมากไปน้อยและดึงมา 5 อันดับแรก เพื่อให้เห็นภาพรวมได้รวดเร็วและชัดเจนมากกว่าการที่มีหลายๆอันดับ โดยมีการกรองจาก query

- เอาที่ดาวมากกว่า 1
- เอา archived ออก
- ดึงมา 5 รายการ
- sort ด้วย star จากมากไปน้อย

เนื่องจากว่า Top Repo คือ Repo ทุกรูปแบบรวม Text Doc Code ทุกอย่างเพื่อให้เห็นว่าใครกันที่เป็นตัวเต็งดังนั้นจะกรองแค่ที่ archived ออกไปแล้วเท่านั้น

```
GET /search/repositories?q=stars:>1 archived:false&per_page=5&sort=stars&order=desc
```

#### การกำหนด Trending Repository

กำหนดด้วย star เช่นกัน โดย query จะคล้ายๆกับ Top Repository และเพิ่มส่วนวันที่เข้ามาเพื่อกรองวันที่ โดยแบ่งออกเป็น 3 เงื่อนไข

- **Today** วิธีคิดคือผมจะดึงเวลามาละใช้ ISO Time เพราะมัน format และท่าเขียนง่ายมาก
  - การใช้ดาวจะ detect ว่า อันไหนมีมากกว่า 10 เพราะรู้สึกว่า 10 ใน 1 วันก็มีความน่าสนใจมากๆแล้ว
- **This Week** วิธีคิดคือ ผมจะดึงวันปัจุบันมา ละดึงวันที่มาลบกับวันในสัปดาห์ เช่น
  - วันนี้วันพุธที่ 20 เมษา ซึ่งใน 1 สัปดาห์ถ้านับจากวันอาทิตย์จะเป็นวันที่ 3 ( อาทิตย์ = 0 )
  - ผมเอาวันที่ 20 ตั้ง และถอยหลัง 3 วัน จะได้วันที่ 17 เท่ากับว่าผมจะได้ วันเริ่มต้นสัปดาห์
  - จากนั้นหา วันจบสัปดาห์ด้วยการบวกเข้าไป 6 วัน ก็จะได้ 17 + 6 = 23
  - การใช้ดาวจะ detect ว่า อันไหนมีมากกว่า 100 เพราะว่าใน 1 สัปดาห์ ก็ตกวันละ 14 คน คิดว่าก็เยอะพอสมควร
- **This month** วิธีคิดคือ
  - ถ้าจะหาต้นเดือน ก็กำหนดเป็น วันที่ 1 โดยใช้ ปีปัจจุบัน เดือนปัจจุบัน
  - ถ้าจะหาสิ้นเดือน ก็กำหนดเหมือนกันแค่เดือน + 1 และกำหนดให้มันเรียกวันก่อนหน้าวันนึง
  - การใช้ดาวจะ detect ว่า อันไหนมีมากกว่า 1000 เพราะแสดงให้เห็นถึงการเติบโต หากเติบโตแบบรวดเร็วยังไงก็เกิน 1000 แน่นอน

ซึ่งผมใช้ format ISOString เพราะเห็นว่ามันเขียนง่ายดี แต่จะเจอปัญหาเรื่อง ISO → UTC มันจะดึงเวลาโลกที่เป็น UTC +0 มา ทำให้มันจะเพี้ยนในไทย และ ประเทศอื่นๆ สิ่งที่ผมแก้ก็คือ ผมทำการ getOffsetTimeZone ของเครื่องมาเพื่อที่ว่าจะดูว่ามันห่างเท่าไหร่จากเวลาโลก เราจะได้ค่าติดลบมาแบบนาที ถ้าไทยจะเป็นค่าลบ เพราะไทยคือ UTC + 7 เมื่อเราได้ค่ามาปุ๊ปเราจับลบกับเวลาที่เราอ่านมาจาก ISOString เราก็จะได้เวลาเครื่องจริงมาใช้ครับ

```
# Today
GET /search/repositories?q=created:>=2026-05-17 stars:>10 fork:false archived:false&per_page=5&sort=stars&order=desc

# This Week
GET /search/repositories?q=created:2026-05-11..2026-05-17 stars:>100 fork:false archived:false&per_page=5&sort=stars&order=desc

# This Month
GET /search/repositories?q=created:2026-05-01..2026-05-31 stars:>1000 fork:false archived:false&per_page=5&sort=stars&order=desc
```

---

## 🔌 ใช้ API เส้นไหนบ้าง และ ใช้ทำไม

### 1. List Repository User

```
GET /users/{username}/repos
```

- **Octokit Doc:** https://octokit.github.io/rest.js/v22/#repos-list-for-user
- **GitHub REST Doc:** https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user
- **รับผิดชอบ:** User repo search
- **เหตุผล:** ให้ผลที่ตรงกว่า การใช้ search แนบ query พวก `user:` มากกว่า ก็เลยเลือกเป็นเส้นนี้

### 2. List Repository Organization

```
GET /orgs/{org}/repos
```

- **Octokit Doc:** https://octokit.github.io/rest.js/v22/#repos-list-for-org
- **GitHub REST Doc:** https://docs.github.com/en/rest/repos/repos#list-organization-repositories
- **รับผิดชอบ:** ORG repo search
- **เหตุผล:** เหมือนกับ User เพราะว่าให้ผลลัพธ์ที่ตรงกว่าเส้น search ที่แนบ query `org:`

### 3. Search Repositories

```
GET /search/repositories
```

- **Octokit Doc:** https://octokit.github.io/rest.js/v22/#search-repos
- **GitHub REST Doc:** https://docs.github.com/en/rest/search/search#search-repositories
- **รับผิดชอบ:** Trending, Top, Search Repo
- **เหตุผล:** การค้นหา repository จำเป็นต้องใช้ search เข้ามาช่วย ซึ่งเราสามารถ แนบ query เพิ่มเติมเพื่อที่จะ sort หรือ กรองพวก repo ขยะออกไปได้

### 4. Get Repository

```
GET /repos/{owner}/{repo}
```

- **Octokit Doc:** https://octokit.github.io/rest.js/v22/#repos-get
- **GitHub REST Doc:** https://docs.github.com/en/rest/repos/repos#get-a-repository
- **รับผิดชอบ:** Full name search (Detail Page)
- **เหตุผล:** ต้องการค้นหา repository แบบเฉพาะเจาะจงดังนั้นเลยใช้เส้นนี้เพราะตรงกับความต้องการมากกว่า จริงๆเส้น search ก็สามารถใช้ได้แต่ว่าการดึงข้อมูลเดี่ยวๆแบบนี้ไม่น่าจำเป็นที่จะต้องใช้ search

---

## 💡 Improvement

สิ่งที่จะปรับปรุงหากมีเวลาเพิ่ม:

- **ทำ Token Design** สมมุติว่ามีการขยาย Feature จะได้ไว้ Reuse และ เป็น มาตรฐานเรื่อง Style
- **ทำ UI หน้า Detail ให้ละเอียดมากขึ้น** เพราะตอนนี้ก็พอประมาณเพราะรู้สึกว่าการ Design หน้า detail นี่มีแค่ข้อมูลจำเป็นก็เพียงพอเพราะเราสามารถโยงไปที่ Repo ตัวจริงได้ อีกทั้งประหยัดเวลาอีก
- **หาวิธีใหม่ในการจัดการเรื่อง search result ของ user, org** เป็นเพราะว่าจำนวนผลลัพธ์เกิดจากการประมาณจาก `totalPage × limit` ดังนั้นต่อให้รายการที่เจอจะมีครบ แต่เลขที่แสดงอาจจะไม่ตรงกัน
