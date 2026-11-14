# Что если прыгнуть в дыру сквозь всю Землю - сценарий, раскадровка, смета

Статус: черновик v1, ждет одобрения. Кредиты не потрачены (0 из 10 000).
Холст ElevenLabs: flow `N7a17CusGqxumb1XqUPo` ("Что если - дыра сквозь Землю").

---

## 1. Проверка фактов

| Утверждение | Вердикт | Комментарий |
|---|---|---|
| Путь сквозь Землю около 42 минут | Верно только для модели **однородной** Земли (42 мин 12 с) | С реальной плотностью (модель PREM, Klotz, Am. J. Phys. 2015) выходит **38 мин 11 с**. Слова "идеальная дыра" закрывают воздух и трение, но не плотность Земли. |
| До центра 21 минута | Верно для той же модели (половина от 42) | С реальной плотностью около 19 минут. |
| Скорость в центре около 8 км/с | Верно для однородной Земли (7,9 км/с, у Klotz: "near 8 km/s") | С реальной плотностью выше. Моя оценка по двухслойной модели (ядро + мантия): около 9,6 км/с. Это мой расчет, в источнике этой цифры нет. |
| Ядро около 6000 °C, примерно как поверхность Солнца | Верно с оговоркой "примерно" | ESRF, Science 2013: около 6000 ± 500 °C на границе внутреннего ядра. Фотосфера Солнца около 5500 °C. |
| Вылетаешь ровно до края | Верно в идеальной дыре (закон сохранения энергии) | На вершине скорость на мгновение равна нулю. Промах - это сюжет, физике не противоречит. |
| Прыгнул на закате, вылетаешь на рассвете | Верно | Граница дня и ночи - большой круг. Если у тебя закат, в точке-антиподе в этот же момент рассвет, в любое время года. |
| Вращение Земли | В ролике не упоминаем | В трубе без трения стенки просто направляют тебя, на время пути вращение влияет примерно на 4 секунды (Klotz со ссылкой на Cooper 1966). |
| Жара по пути | Не упоминаем | В реальности ты бы сгорел еще в мантии. Это покрыто словом "идеальная". В комментариях об этом напишут, это нормально. |

**Вариант замены цифр (если хочешь, чтобы к цифрам нельзя было придраться):**
- "Через 21 минуту" -> "Минут через двадцать"
- "почти 8 километров в секунду" -> "быстрее, чем летит МКС" (МКС 7,66 км/с; это верно в обеих моделях)
- "42 минуты обратно" -> "Сорок минут обратно" или "38 минут обратно"

---

## 2. Сценарий (озвучка)

Около 87 слов, ориентировочно 32-34 секунды. Цифры в тексте для eleven_v4 оставлены цифрами (так советует гайд модели), на прослушке проверю склонение "21 минуту" и "42 минуты". Если ошибется, перепишу словами.

> Ты прыгаешь в дыру, которая проходит сквозь всю Землю.
> Дыра идеальная: без воздуха и без трения.
> Каждую секунду ты падаешь быстрее.
> Через 21 минуту - центр планеты.
> Скорость - почти 8 километров в секунду.
> Вокруг ядро: около 6000 градусов. Примерно как на поверхности Солнца.
> А потом гравитация начинает тянуть тебя назад.
> Ты тормозишь. Медленнее. Ещё медленнее.
> Ты прыгнул на закате. А вылетаешь на рассвете, на другой стороне планеты.
> Ровно до края. У тебя одно мгновение, чтобы схватиться...
> Мимо.
> 42 минуты обратно. Снова край. Снова мимо. И так вечно.

Петля: последний кадр уходит в темноту шахты, ролик перезапускается с кадра 1, где герой снова прыгает. Фраза "И так вечно" плюс первый кадр читаются как продолжение.

Голос: **Aleksandr - Documentary Narrator** (`JMT0QtVym2S8gHCkBqMp`): молодой, спокойный, четкая дикция, московский выговор, без пафоса. Модель eleven_v4. Запасные: Pavel - Warm Conversational Narrator, Egor.

---

## 3. Карточки

**КАРТОЧКА ПЕРСОНАЖА** (вставляется дословно в каждый промпт):
`CHARACTER: a 20-year-old young man, slim athletic build, oval face, light olive skin, short messy dark-brown hair swept to one side, dark-brown eyes, thick straight eyebrows, clean-shaven; bright orange pullover hoodie with white drawstrings and a front pocket, charcoal-grey jogger pants, clean white low-top sneakers with white soles.`

**КАРТОЧКА МИРА:**
`WORLD: warm orange-and-teal cinematic palette. Side A: flat dusty steppe at sunset, low golden sun. The tunnel: a perfectly round smooth shaft about 3 meters wide with polished rock walls; deeper rock glows from dark red (mantle) to blinding white-orange (core). Side B: misty green plain at dawn, cool pink-blue sky, low rising sun.`

**СТИЛЬ (префикс):**
`3D animated render, semi-realistic stylized character, soft cinematic lighting, subsurface skin shading, shallow depth of field, high detail, vertical 9:16 composition.`

**НЕГАТИВ** (у моделей Gemini нет отдельного поля, пишется в конец промпта):
`Avoid: text, watermark, logo, extra fingers, distorted face, 2D cartoon, anime.`

---

## 4. Раскадровка

Тайминги ориентировочные, финально подгоню по реальной озвучке (паузы найду через ffmpeg silencedetect).
"F" - номер уникальной картинки. Всего 12 уникальных картинок + 1 карточка персонажа. Повторы бесплатные.
Звездочка * - кандидат в анимацию, если появится доступ к видео.

| № | Время | Дл. | Картинка | Что в кадре | Камера / движение в ffmpeg | Озвучка | Звуки |
|---|---|---|---|---|---|---|---|
| 1 | 0,0-3,2 | 3,2 | F01* | Парень в оранжевой толстовке в прыжке над идеально круглой черной дырой в степи, закат, контровой свет | Высокий ракурс 3/4. Быстрый наезд + легкая тряска | Ты прыгаешь в дыру, которая проходит сквозь всю Землю. | Порыв ветра, свуш на склейке |
| 2 | 3,2-5,4 | 2,2 | F02 | Вид его глазами вниз между белыми кроссовками: гладкая шахта сходится в точку | От первого лица. Резкий зум внутрь (головокружение) | Дыра идеальная: без воздуха и без трения. | На слове "воздуха" ветер обрывается в тишину, остается низкий гул |
| 3 | 5,4-7,2 | 1,8 | F03 | Он падает головой вниз, шнурки и волосы парят (воздуха нет, ничего не треплется), стены смазаны | Сбоку, сопровождение. Вертикальная панорама с ускорением | Каждую секунду ты падаешь быстрее. | Нарастающий свист |
| 4 | 7,2-9,6 | 2,4 | F04 | Разрез Земли: кора, мантия, ядро, тонкая светящаяся линия тоннеля, крошечная оранжевая точка у центра | Рентген / разрез. Медленный наезд к центру | Через 21 минуту - центр планеты. | Глубокий удар (бум) |
| 5 | 9,6-12,0 | 2,4 | F05 | Макро лица: спокойный, глаза широко, волосы вверх, лицо в оранжевом свете, фон - сплошная полоса света | Сверхкрупно. Мелкая тряска | Скорость - почти 8 километров в секунду. | Высокий вой скорости |
| 6 | 12,0-14,4 | 2,4 | F06* | Крошечный силуэт в тоннеле сквозь раскаленное добела железное ядро, искры, марево | Невозможный кадр внутри ядра. Наезд + мерцание яркости | Вокруг ядро: около 6000 градусов. | Рев огня и металла (SFX ElevenLabs) |
| 7 | 14,4-16,4 | 2,0 | F07 | Поверхность Солнца: грануляция, протуберанец, та же палитра | Макро. Медленный поворот + зум | Примерно как на поверхности Солнца. | Тот же рев, глуше |
| 8 | 16,4-19,0 | 2,6 | F08 | Снизу: он уже за центром, летит ногами вверх, стены темнеют до красного, вверху точка света | Снизу вверх. Панорама, которая замедляется | А потом гравитация начинает тянуть тебя назад. | Свуш с понижением тона |
| 9 | 19,0-21,6 | 2,6 | F09 | Сверху: он медленно поднимается к камере, смотрит вверх, на лице холодный рассветный свет | Сверху вниз. Плавный выезд с замедлением | Ты тормозишь. Медленнее. Ещё медленнее. | Три удара сердца в такт словам |
| 10 | 21,6-22,8 | 1,2 | F01 (повтор) | Вспышка кадра 1: прыжок на закате | Стоп-кадр, теплый фильтр | Ты прыгнул на закате. | Короткий свуш |
| 11 | 22,8-25,6 | 2,8 | F10* | Другая сторона планеты, рассвет, туман, зеленая равнина, из такой же дыры по грудь поднимается он | Общий план. Медленный наезд | А вылетаешь на рассвете, на другой стороне планеты. | Птицы, утренний воздух (SFX) |
| 12 | 25,6-28,6 | 3,0 | F11 | Макро руки: пальцы в сантиметре от края, роса, лицо в расфокусе | Макро, ощущение замедления. Очень медленный наезд | Ровно до края. У тебя одно мгновение, чтобы схватиться... | Звук почти пропадает, одно сердцебиение |
| 13 | 28,6-29,6 | 1,0 | F12* | Сверху в дыру: пальцы проскользнули мимо края, он падает обратно, шок на лице | Сверху. Резкий отъезд + тряска | Мимо. | Скрежет пальцев по краю, свуш вниз |
| 14 | 29,6-31,0 | 1,4 | F04 (повтор) | Тот же разрез Земли, точка летит обратно | Быстрый отъезд, кадр отзеркален | 42 минуты обратно. | Гул |
| 15 | 31,0-33,8 | 2,8 | F12 (повтор) | Он проваливается в темноту, кадр уходит в черное, затем петля на кадр 1 | Наезд в черноту шахты | Снова край. Снова мимо. И так вечно. | Ветер нарастает и переходит в порыв кадра 1 |

Итого около 34 секунд, 15 склеек, новый визуал не реже чем раз в 3,2 секунды. Невозможные кадры: 4 и 14 (разрез), 5 (сверхкрупно на 8 км/с), 6 (внутри ядра), 12 (замедление).

---

## 5. Промпты картинок (английский)

Каждый промпт = СТИЛЬ + описание кадра + КАРТОЧКА ПЕРСОНАЖА (где он есть в кадре) + КАРТОЧКА МИРА + НЕГАТИВ. Карточка персонажа (картинка) подключается как референс к каждому кадру с героем.

- **F00 карточка персонажа:** Character reference sheet: the same character shown twice side by side, full body front view and full body three-quarter view, neutral light-grey studio background, even soft key light.
- **F01:** Wide high-angle three-quarter shot: the CHARACTER mid-air in a dynamic jump, body tilted forward, arms spread, sneakers up, directly above the center of a perfectly round black hole about 3 meters wide cut into a flat dusty steppe at sunset; the hole is an endless pitch-black shaft with a crisp clean edge; low golden sun behind him, long shadows, warm rim light on the hoodie, dust kicked up at the edge.
- **F02:** First-person POV looking straight down between the CHARACTER's own white sneakers into a perfectly smooth round vertical shaft, polished dark rock walls converging to a single tiny point far below, faint warm sunset light from above fading into darkness, extreme depth, vertigo.
- **F03:** Side tracking shot inside the round tunnel: the CHARACTER falling head-down in calm free fall, hoodie drawstrings and hair floating weightlessly, polished rock walls streaked with vertical motion blur, rock strata glowing faint red further below, sense of acceleration.
- **F04:** Cinematic 3D cutaway cross-section of planet Earth in vertical composition: crust, mantle, liquid outer core and glowing inner core with accurate proportions, a thin perfectly straight bright tunnel line running from the top surface through the exact center to the bottom surface, a tiny glowing orange figure on the line just above the center, dark space background, clean scientific visualization look. (Без персонажа крупно, карточка не нужна.)
- **F05:** Extreme close-up of the CHARACTER's face in free fall inside the tunnel, calm but wide-eyed, hair floating upward, face lit by intense orange glow from below, background walls reduced to pure streaks of orange-white light, motion blur, enormous speed.
- **F06:** Epic wide shot: the CHARACTER as a small dark silhouette flying through a perfectly straight round tunnel that passes through the white-hot glowing iron of the Earth's inner core, walls blazing white-orange, sparks, heat shimmer, overwhelming scale.
- **F07:** Macro shot of the surface of the Sun: boiling granulation cells, glowing orange-white plasma, a small solar prominence arc in the center of the frame, same orange-white palette, cinematic. (Без персонажа.)
- **F08:** Low-angle shot from below: the CHARACTER rising feet-first up the tunnel, the orange glow of the core fading below him, the walls turning from orange to dark red rock, a tiny bright circle of daylight far above at the end of the tunnel.
- **F09:** Top-down shot from inside the upper part of the tunnel: the CHARACTER rising slowly toward the camera, face turned up, hopeful, hoodie and hair settling, dark rock walls, cool dawn light falling on his face from above.
- **F10:** Wide shot at dawn on the other side of the planet: misty green plain, cool pink-blue sky, low rising sun, an identical perfectly round black hole in the grass; the CHARACTER emerging from the hole up to his chest, rising slowly, surprised face, dew on the grass, soft morning light.
- **F11:** Macro close-up: the CHARACTER's hand reaching for the grassy edge of the hole, fingertips one centimeter from the rim, his face out of focus behind, desperate, frozen moment at the top of the arc, dawn backlight, dew drops, slow-motion feel.
- **F12:** Overhead shot looking straight down into the hole at dawn: the CHARACTER falling back into the darkness, one hand still stretched up toward the edge, fingers just missed, shocked face, grass at the rim in the foreground, the shaft below him pitch black.

## 6. Промпты видео (на случай доступа к анимации, image-to-video, 4-5 с, одно действие)

- **V01 (из F01):** Slow push-in. The character drops straight down into the hole and disappears into the darkness; dust swirls at the rim.
- **V06 (из F06):** Camera tracks with the character as he flies straight through the glowing tunnel toward the camera, walls streaming past at extreme speed, heat shimmer.
- **V10 (из F10):** Static camera. The character rises slowly out of the hole up to his chest and stops for an instant at the top; morning mist drifts.
- **V12 (из F12):** Static overhead camera. His fingertips slip past the rim and he falls back into the darkness, shrinking quickly.

---

## 7. Смета (ElevenLabs, проверено через estimate, ничего не списано)

Цены за 1 картинку 1K, которые выдал эстиматор:

| Модель | Кредиты за картинку |
|---|---|
| Nano Banana Pro (gemini-3-pro-image) | 1218 |
| Nano Banana 2 (gemini-3.1-flash-image) | 406 |
| FLUX.2 Pro | 273 |
| Nano Banana (gemini-2.5-flash-image) | 251 |
| **Nano Banana 2 Lite (gemini-3.1-flash-lite-image)** | **206** |
| Krea 2 Medium | 182 |

План на Nano Banana 2 Lite (держит референс персонажа, дешевая):

| Статья | Кредиты |
|---|---|
| Карточка персонажа, 2 варианта | ~412 |
| 12 ключевых кадров по 1 варианту | ~2 470 |
| Запас на 5 перегенераций | ~1 030 |
| Озвучка eleven_v4, 2 дубля (~556 за дубль) | ~1 112 |
| Запас на переделку 1-2 фраз | ~200 |
| 4 звука SFX по ~3 с (20 кредитов/с) | ~240 |
| Свуши, гул, удары, сердце | 0 (синтез в ffmpeg) |
| **Итого** | **~5 460 из 10 000** |
| Видео | **недоступно на бесплатном тарифе** |

Цена кадра с подключенным референсом может быть чуть выше 206, это станет видно на первом запуске.

## 8. Монтаж (ffmpeg, все уже есть в контейнере)

1080x1920, 30 fps, H.264, AAC, `-preset veryfast`. Движение статичных кадров через zoompan с easing, тряску и смену скорости. Субтитры ASS шрифтом Inter Black (кириллица есть), белый с черной обводкой, 2-4 слова в строке, ключевое слово желтым, чуть выше центра. Голос около -14 LUFS (loudnorm), звуки под голосом. Последний кадр уходит в начало для петли.
