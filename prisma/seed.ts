// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();

  // 샘플 로봇 상품 데이터
  const products = [
    {
      name: { ko: "코지모 AI 반려로봇", en: "Cozimo AI Companion Robot" },
      price: 899000,
      description: {
        ko: "감정 인식과 대화가 가능한 귀여운 AI 반려로봇. 외로움을 달래주는 완벽한 친구입니다.",
        en: "A cute AI companion robot capable of emotion recognition and conversation. Perfect friend to cure loneliness.",
      },
      images: [
        "https://images.unsplash.com/photo-1559715541-d4fc97b8d6dd?w=500",
        "https://images.unsplash.com/photo-1659018966820-de07c94e0d01?w=500",
        "https://plus.unsplash.com/premium_photo-1741881406929-6945240017e8?w=500",
      ],
      stock: 45,
      category: { ko: "반려로봇", en: "Companion Robot" },

      features: {
        items: [
          {
            icon: "mic",
            title: { ko: "감정 대화", en: "Emotion-aware chat" },
            desc: {
              ko: "말투와 표정을 분석해 상황에 맞는 대화를 제공합니다.",
              en: "Understands tone and expression for context-aware conversation.",
            },
          },
          {
            icon: "speaker",
            title: { ko: "음악/알림", en: "Music & notifications" },
            desc: { ko: "음악 재생과 리마인더, 생활 알림을 지원합니다.", en: "Supports music playback, reminders, and daily notifications." },
          },
          {
            icon: "camera",
            title: { ko: "사진/영상", en: "Photo & video" },
            desc: { ko: "원격으로 사진 촬영과 영상 확인이 가능합니다.", en: "Capture photos and view video remotely." },
          },
          {
            icon: "smartphone",
            title: { ko: "앱 연동", en: "App connectivity" },
            desc: { ko: "전용 앱에서 설정/상태 확인/제어가 가능합니다.", en: "Configure, monitor, and control via the dedicated app." },
          },
        ],
      },
      detailInfo: {
        maker: "RoboTech Industries",
        origin: { ko: "대한민국", en: "Korea" },
        warranty: { ko: "구입일로부터 1년", en: "1 year from purchase" },
        as: { ko: "RoboTech 고객센터 (1588-0000)", en: "RoboTech Support Center (+82-1588-0000)" },
        cert: "R-R-RBT-COZIMO-2025",
      },
      specs: {
        basic: {
          size: { ko: "220 x 180 x 320 mm", en: "220 x 180 x 320 mm" },
          weight: { ko: "2.1 kg", en: "2.1 kg" },
          connect: { ko: "Wi-Fi 6, Bluetooth 5.2", en: "Wi-Fi 6, Bluetooth 5.2" },
          camera: { ko: "2K, 120° 광각", en: "2K, 120° wide angle" },
          mic: { ko: "4-마이크 어레이, 노이즈 캔슬링", en: "4-mic array, noise cancelling" },
          speaker: { ko: "20W 스테레오", en: "20W stereo" },
        },
        performance: {
          cpu: { ko: "Octa-core AI SoC", en: "Octa-core AI SoC" },
          ram: { ko: "6GB", en: "6GB" },
          storage: { ko: "64GB", en: "64GB" },
          battery: { ko: "최대 10시간", en: "Up to 10 hours" },
          charge: { ko: "USB-C 고속 충전", en: "USB-C fast charging" },
          os: { ko: "RoboOS 3.0", en: "RoboOS 3.0" },
        },
        support: [
          { ko: "감정 인식 대화", en: "Emotion-aware chat" },
          { ko: "리마인더/알림", en: "Reminders & notifications" },
          { ko: "원격 영상 확인", en: "Remote video viewing" },
          { ko: "다국어 대화", en: "Multilingual conversation" },
        ],
      },
      guide: {
        sections: [
          {
            type: "steps",
            title: { ko: "시작하기", en: "Getting started" },
            items: [
              { title: { ko: "전원 켜기", en: "Power on" }, desc: { ko: "전원 버튼을 2초 이상 길게 눌러 켭니다.", en: "Press and hold the power button for 2 seconds." } },
              { title: { ko: "앱 연결", en: "Connect the app" }, desc: { ko: "앱에서 기기를 추가하고 Wi-Fi를 설정하세요.", en: "Add the device in the app and set up Wi-Fi." } },
              { title: { ko: "대화 시작", en: "Start chatting" }, desc: { ko: "호출어를 말하면 대화가 시작됩니다.", en: "Say the wake word to start a conversation." } },
            ],
          },
          {
            type: "cards",
            title: { ko: "주요 사용 예시", en: "Common actions" },
            items: [
              { cmd: { ko: "코지모, 오늘 일정 알려줘", en: "Tell me my schedule" }, desc: { ko: "오늘 일정/리마인더를 안내합니다.", en: "Reads today's schedule and reminders." } },
              { cmd: { ko: "코지모, 음악 틀어줘", en: "Play music" }, desc: { ko: "등록된 음악/스트리밍을 재생합니다.", en: "Plays saved music or streaming." } },
              { cmd: { ko: "코지모, 사진 찍어줘", en: "Take a photo" }, desc: { ko: "사진을 촬영하고 앨범에 저장합니다.", en: "Takes a photo and saves it to the album." } },
              { cmd: { ko: "코지모, 조용히 해", en: "Mute" }, desc: { ko: "스피커를 음소거합니다.", en: "Mutes the speaker." } },
            ],
          },
          {
            type: "bullets",
            title: { ko: "주의사항", en: "Caution" },
            items: [
              { ko: "충전 중에는 통풍이 잘 되는 곳에 두세요.", en: "Keep it in a well-ventilated area while charging." },
              { ko: "카메라 렌즈는 부드러운 천으로 닦아주세요.", en: "Clean the camera lens with a soft cloth." },
              { ko: "강한 충격이나 낙하를 피하세요.", en: "Avoid drops and strong impacts." },
            ],
          },
        ],
      },
    },

    {
      name: { ko: "서빙봇 프로 MAX", en: "Serving Bot Pro MAX" },
      price: 3490000,
      description: {
        ko: "카페와 레스토랑을 위한 스마트 서빙 로봇. 자율주행으로 안전하고 정확한 서빙을 제공합니다.",
        en: "Smart serving robot for cafes and restaurants. Provides safe and precise serving with autonomous navigation.",
      },
      images: [
        "https://images.unsplash.com/photo-1629248242733-43d4013f33a1?w=500",
        "https://plus.unsplash.com/premium_photo-1757096613035-818a14f001d3?w=500",
      ],
      stock: 12,
      category: { ko: "서비스로봇", en: "Service Robot" },

      features: {
        items: [
          { icon: "camera", title: { ko: "자율주행", en: "Autonomous navigation" }, desc: { ko: "장애물 회피와 경로 최적화로 안전하게 이동합니다.", en: "Moves safely with obstacle avoidance and route optimization." } },
          { icon: "smartphone", title: { ko: "테이블 배차", en: "Table dispatch" }, desc: { ko: "앱에서 테이블로 호출/배차를 손쉽게 설정합니다.", en: "Dispatch and call to tables easily from the app." } },
          { icon: "speaker", title: { ko: "도착 안내", en: "Arrival 안내" }, desc: { ko: "도착/수거/복귀 등 상태를 안내합니다.", en: "Announces status like arrival, pickup, and return." } },
          { icon: "mic", title: { ko: "현장 명령", en: "On-site commands" }, desc: { ko: "현장 버튼/음성으로 간단 제어가 가능합니다.", en: "Simple control via on-site buttons/voice." } },
        ],
      },
      detailInfo: {
        maker: "RoboTech Industries",
        origin: { ko: "대한민국", en: "Korea" },
        warranty: { ko: "구입일로부터 1년", en: "1 year from purchase" },
        as: { ko: "RoboTech 고객센터 (1588-0000)", en: "RoboTech Support Center (+82-1588-0000)" },
        cert: "R-R-RBT-SERVE-2025",
      },
      specs: {
        basic: {
          size: { ko: "520 x 520 x 1200 mm", en: "520 x 520 x 1200 mm" },
          weight: { ko: "45 kg", en: "45 kg" },
          connect: { ko: "Wi-Fi, LTE 옵션", en: "Wi-Fi, optional LTE" },
          camera: { ko: "Depth 카메라, 120°", en: "Depth camera, 120°" },
          mic: { ko: "듀얼 마이크", en: "Dual microphone" },
          speaker: { ko: "30W", en: "30W" },
        },
        performance: {
          cpu: { ko: "Industrial AI Controller", en: "Industrial AI Controller" },
          ram: { ko: "8GB", en: "8GB" },
          storage: { ko: "128GB", en: "128GB" },
          battery: { ko: "최대 16시간", en: "Up to 16 hours" },
          charge: { ko: "자동 도킹 충전", en: "Auto docking charge" },
          os: { ko: "RoboOS Fleet", en: "RoboOS Fleet" },
        },
        support: [
          { ko: "자율주행 서빙", en: "Autonomous serving" },
          { ko: "구역/경로 관리", en: "Zone & route management" },
          { ko: "다중 로봇 운영", en: "Multi-robot operation" },
          { ko: "원격 모니터링", en: "Remote monitoring" },
        ],
      },
      guide: {
        sections: [
          {
            type: "steps",
            title: { ko: "초기 설정", en: "Initial setup" },
            items: [
              { title: { ko: "지도 생성", en: "Create map" }, desc: { ko: "매장 전체를 1회 주행해 지도를 생성합니다.", en: "Run once to create a map of the venue." } },
              { title: { ko: "테이블 등록", en: "Register tables" }, desc: { ko: "앱에서 테이블 번호와 목적지를 등록합니다.", en: "Register table numbers and destinations in the app." } },
              { title: { ko: "테스트 주행", en: "Test run" }, desc: { ko: "혼잡 구간/회전 반경을 확인합니다.", en: "Check crowded zones and turning radius." } },
            ],
          },
          {
            type: "cards",
            title: { ko: "빠른 작업", en: "Quick actions" },
            items: [
              { cmd: { ko: "테이블로 출발", en: "Go to table" }, desc: { ko: "선택한 테이블로 이동합니다.", en: "Moves to the selected table." } },
              { cmd: { ko: "복귀", en: "Return" }, desc: { ko: "대기 지점/도크로 복귀합니다.", en: "Returns to standby/dock." } },
              { cmd: { ko: "일시정지", en: "Pause" }, desc: { ko: "현재 동작을 일시정지합니다.", en: "Pauses the current operation." } },
              { cmd: { ko: "재개", en: "Resume" }, desc: { ko: "일시정지 상태에서 재개합니다.", en: "Resumes from pause." } },
            ],
          },
          {
            type: "bullets",
            title: { ko: "운영 팁", en: "Operation tips" },
            items: [
              { ko: "혼잡 시간에는 속도를 낮춰 운영하세요.", en: "Lower speed during peak hours." },
              { ko: "바닥 상태(물기/매트)를 정리하면 주행이 안정적입니다.", en: "Keep floors dry and clear for stable driving." },
            ],
          },
        ],
      },
    },

    {
      name: { ko: "가디언 보안로봇", en: "Guardian Security Robot" },
      price: 2890000,
      description: {
        ko: "24시간 자율 순찰이 가능한 보안 로봇. 얼굴 인식과 침입자 감지 기능을 제공합니다.",
        en: "Security robot capable of 24/7 autonomous patrol. Provides facial recognition and intruder detection features.",
      },
      images: [
        "https://images.unsplash.com/photo-1641312874336-6279a832a3dc?w=500",
        "https://images.unsplash.com/photo-1738054040695-d6f1f0e161ac?w=500",
      ],
      stock: 8,
      category: { ko: "보안로봇", en: "Security Robot" },

      features: {
        items: [
          { icon: "camera", title: { ko: "침입 감지", en: "Intruder detection" }, desc: { ko: "AI 비전으로 이상 징후를 감지하고 알림을 전송합니다.", en: "Detects anomalies via AI vision and sends alerts." } },
          { icon: "smartphone", title: { ko: "원격 감시", en: "Remote monitoring" }, desc: { ko: "앱에서 실시간 영상과 로그를 확인할 수 있습니다.", en: "View live video and logs from the app." } },
          { icon: "mic", title: { ko: "양방향 통화", en: "Two-way talk" }, desc: { ko: "현장과 원격 간 음성 통화가 가능합니다.", en: "Supports two-way voice communication." } },
          { icon: "speaker", title: { ko: "경고 방송", en: "Warning announcements" }, desc: { ko: "침입 상황에 경고 안내를 재생합니다.", en: "Plays warning prompts during incidents." } },
        ],
      },
      detailInfo: {
        maker: "RoboTech Industries",
        origin: { ko: "대한민국", en: "Korea" },
        warranty: { ko: "구입일로부터 1년", en: "1 year from purchase" },
        as: { ko: "RoboTech 고객센터 (1588-0000)", en: "RoboTech Support Center (+82-1588-0000)" },
        cert: "R-R-RBT-GUARD-2025",
      },
      specs: {
        basic: {
          size: { ko: "420 x 390 x 980 mm", en: "420 x 390 x 980 mm" },
          weight: { ko: "18 kg", en: "18 kg" },
          connect: { ko: "Wi-Fi 6, LTE", en: "Wi-Fi 6, LTE" },
          camera: { ko: "4K, IR 야간", en: "4K, IR night vision" },
          mic: { ko: "4-마이크 어레이", en: "4-mic array" },
          speaker: { ko: "40W", en: "40W" },
        },
        performance: {
          cpu: { ko: "Edge AI Processor", en: "Edge AI Processor" },
          ram: { ko: "8GB", en: "8GB" },
          storage: { ko: "256GB", en: "256GB" },
          battery: { ko: "최대 14시간", en: "Up to 14 hours" },
          charge: { ko: "자동 도킹 충전", en: "Auto docking charge" },
          os: { ko: "RoboOS Secure", en: "RoboOS Secure" },
        },
        support: [
          { ko: "24시간 순찰", en: "24/7 patrol" },
          { ko: "얼굴 인식", en: "Facial recognition" },
          { ko: "침입 알림", en: "Intrusion alerts" },
          { ko: "보안 로그", en: "Security logs" },
        ],
      },
      guide: {
        sections: [
          {
            type: "steps",
            title: { ko: "설치/설정", en: "Install & set up" },
            items: [
              { title: { ko: "순찰 구역 지정", en: "Set patrol area" }, desc: { ko: "앱에서 순찰 구역과 금지 구역을 설정하세요.", en: "Set patrol and no-go zones in the app." } },
              { title: { ko: "알림 연결", en: "Connect alerts" }, desc: { ko: "침입 감지 알림을 받을 기기를 등록하세요.", en: "Register devices to receive intruder alerts." } },
              { title: { ko: "야간 모드", en: "Night mode" }, desc: { ko: "야간 감시 민감도를 조절하세요.", en: "Adjust monitoring sensitivity for night mode." } },
            ],
          },
          {
            type: "text",
            title: { ko: "운영 안내", en: "Operation notes" },
            body: { ko: "개인정보 보호를 위해 촬영 구역과 녹화 설정을 확인하세요.", en: "Check recording areas and settings to protect privacy." },
          },
          {
            type: "bullets",
            title: { ko: "주의사항", en: "Caution" },
            items: [
              { ko: "강한 역광 환경에서는 인식 성능이 달라질 수 있습니다.", en: "Recognition may vary under strong backlight." },
              { ko: "펌웨어를 최신으로 유지하세요.", en: "Keep firmware up to date." },
            ],
          },
        ],
      },
    },

    {
      name: { ko: "키티봇 교육로봇", en: "KittyBot Educational Robot" },
      price: 459000,
      description: {
        ko: "코딩교육을 위한 귀여운 고양이 모양 교육로봇. 아이들의 창의력을 키워줍니다.",
        en: "Cute cat-shaped educational robot for coding education. Enhances children's creativity.",
      },
      images: [
        "https://images.unsplash.com/photo-1684369176170-463e84248b70?w=500",
        "https://plus.unsplash.com/premium_photo-1677094310956-7f88ae5f5c6b?w=500",
        "https://images.unsplash.com/photo-1590065672897-8cd8dc54a530?w=500",
      ],
      stock: 95,
      category: { ko: "교육로봇", en: "Educational Robot" },

      features: {
        items: [
          { icon: "smartphone", title: { ko: "블록 코딩", en: "Block coding" }, desc: { ko: "드래그&드롭으로 코딩을 쉽고 재미있게 배웁니다.", en: "Learn coding easily with drag-and-drop blocks." } },
          { icon: "mic", title: { ko: "음성 학습", en: "Voice learning" }, desc: { ko: "발음/대화 기반 학습 콘텐츠를 제공합니다.", en: "Learning content via pronunciation and dialogue." } },
          { icon: "camera", title: { ko: "비전 미션", en: "Vision missions" }, desc: { ko: "미션 카드를 인식해 활동을 진행합니다.", en: "Recognizes mission cards to run activities." } },
          { icon: "speaker", title: { ko: "피드백 사운드", en: "Audio feedback" }, desc: { ko: "정답/오답에 따라 즉시 피드백을 줍니다.", en: "Instant feedback for correct/incorrect answers." } },
        ],
      },
      detailInfo: {
        maker: "RoboTech Industries",
        origin: { ko: "대한민국", en: "Korea" },
        warranty: { ko: "구입일로부터 1년", en: "1 year from purchase" },
        as: { ko: "RoboTech 고객센터 (1588-0000)", en: "RoboTech Support Center (+82-1588-0000)" },
        cert: "R-R-RBT-KITTY-2025",
      },
      specs: {
        basic: {
          size: { ko: "180 x 150 x 210 mm", en: "180 x 150 x 210 mm" },
          weight: { ko: "1.2 kg", en: "1.2 kg" },
          connect: { ko: "Wi-Fi, Bluetooth", en: "Wi-Fi, Bluetooth" },
          camera: { ko: "1080p", en: "1080p" },
          mic: { ko: "듀얼 마이크", en: "Dual mic" },
          speaker: { ko: "10W", en: "10W" },
        },
        performance: {
          cpu: { ko: "Quad-core", en: "Quad-core" },
          ram: { ko: "4GB", en: "4GB" },
          storage: { ko: "32GB", en: "32GB" },
          battery: { ko: "최대 6시간", en: "Up to 6 hours" },
          charge: { ko: "USB-C", en: "USB-C" },
          os: { ko: "RoboOS Edu", en: "RoboOS Edu" },
        },
        support: [
          { ko: "블록 코딩", en: "Block coding" },
          { ko: "학습 콘텐츠", en: "Learning content" },
          { ko: "미션 활동", en: "Mission activities" },
          { ko: "학부모 리포트", en: "Parent reports" },
        ],
      },
      guide: {
        sections: [
          {
            type: "steps",
            title: { ko: "시작하기", en: "Getting started" },
            items: [
              { title: { ko: "앱 설치", en: "Install app" }, desc: { ko: "전용 앱을 설치하고 회원가입을 진행하세요.", en: "Install the app and create an account." } },
              { title: { ko: "블루투스 연결", en: "Connect Bluetooth" }, desc: { ko: "앱에서 기기를 추가하고 블루투스를 연결하세요.", en: "Add the device and connect via Bluetooth." } },
              { title: { ko: "첫 미션 실행", en: "Run first mission" }, desc: { ko: "미션 카드로 첫 활동을 시작해보세요.", en: "Start the first activity with mission cards." } },
            ],
          },
          {
            type: "cards",
            title: { ko: "학습 활동", en: "Learning activities" },
            items: [
              { cmd: { ko: "미션 시작", en: "Start mission" }, desc: { ko: "미션 카드를 인식해 활동을 시작합니다.", en: "Recognize mission cards to start activities." } },
              { cmd: { ko: "코딩 실행", en: "Run code" }, desc: { ko: "작성한 블록 코드를 실행합니다.", en: "Runs your block code." } },
              { cmd: { ko: "되돌리기", en: "Undo" }, desc: { ko: "최근 동작을 되돌립니다.", en: "Undoes the last action." } },
              { cmd: { ko: "저장", en: "Save" }, desc: { ko: "프로젝트를 저장합니다.", en: "Saves the project." } },
            ],
          },
          {
            type: "bullets",
            title: { ko: "주의사항", en: "Caution" },
            items: [
              { ko: "어린이는 보호자 지도하에 사용하세요.", en: "Children should use under adult supervision." },
              { ko: "물기/먼지가 많은 곳을 피하세요.", en: "Avoid wet or dusty environments." },
            ],
          },
        ],
      },
    },

    {
      name: { ko: "농업도우미 파머봇", en: "FarmerBot Agricultural Assistant" },
      price: 4290000,
      description: {
        ko: "스마트팜을 위한 농업 자동화 로봇. 파종, 관수, 수확까지 모든 농업 작업을 지원합니다.",
        en: "Agricultural automation robot for smart farms. Supports seeding, watering, and harvesting.",
      },
      images: [
        "https://images.unsplash.com/photo-1597089542047-b9873d82d8ec?w=500",
        "https://plus.unsplash.com/premium_photo-1674624682288-085eff4f98da?w=500",
        "https://images.unsplash.com/photo-1746301469706-ea64999d6f42?w=500",
      ],
      stock: 6,
      category: { ko: "농업로봇", en: "Agricultural Robot" },

      features: {
        items: [
          { icon: "smartphone", title: { ko: "원격 제어", en: "Remote control" }, desc: { ko: "작업 스케줄을 앱에서 설정하고 원격으로 모니터링합니다.", en: "Schedule tasks and monitor remotely via the app." } },
          { icon: "camera", title: { ko: "작물 모니터링", en: "Crop monitoring" }, desc: { ko: "비전 분석으로 생육 상태를 체크합니다.", en: "Checks growth status with vision analytics." } },
          { icon: "mic", title: { ko: "현장 안내", en: "On-site prompts" }, desc: { ko: "작업 상태와 경고를 음성으로 안내합니다.", en: "Announces status and warnings via voice." } },
          { icon: "speaker", title: { ko: "알림", en: "Alerts" }, desc: { ko: "이상 상황을 즉시 알림으로 전달합니다.", en: "Sends instant alerts for anomalies." } },
        ],
      },
      detailInfo: {
        maker: "RoboTech Industries",
        origin: { ko: "대한민국", en: "Korea" },
        warranty: { ko: "구입일로부터 1년", en: "1 year from purchase" },
        as: { ko: "RoboTech 고객센터 (1588-0000)", en: "RoboTech Support Center (+82-1588-0000)" },
        cert: "R-R-RBT-FARM-2025",
      },
      specs: {
        basic: {
          size: { ko: "900 x 700 x 1200 mm", en: "900 x 700 x 1200 mm" },
          weight: { ko: "62 kg", en: "62 kg" },
          connect: { ko: "Wi-Fi, LTE 옵션", en: "Wi-Fi, optional LTE" },
          camera: { ko: "2K, 110°", en: "2K, 110°" },
          mic: { ko: "단일 마이크", en: "Single mic" },
          speaker: { ko: "25W", en: "25W" },
        },
        performance: {
          cpu: { ko: "Industrial Control Unit", en: "Industrial Control Unit" },
          ram: { ko: "8GB", en: "8GB" },
          storage: { ko: "128GB", en: "128GB" },
          battery: { ko: "최대 12시간", en: "Up to 12 hours" },
          charge: { ko: "교체형 배터리", en: "Swappable battery" },
          os: { ko: "RoboOS Field", en: "RoboOS Field" },
        },
        support: [
          { ko: "작업 스케줄링", en: "Task scheduling" },
          { ko: "생육 상태 분석", en: "Growth analysis" },
          { ko: "원격 알림", en: "Remote alerts" },
          { ko: "데이터 리포트", en: "Data reports" },
        ],
      },
      guide: {
        sections: [
          {
            type: "steps",
            title: { ko: "시작하기", en: "Getting started" },
            items: [
              { title: { ko: "작업 구역 설정", en: "Set work zones" }, desc: { ko: "앱에서 하우스/밭 구역을 등록하세요.", en: "Register greenhouse/field zones in the app." } },
              { title: { ko: "작업 모드 선택", en: "Choose mode" }, desc: { ko: "파종/관수/점검 등 작업 모드를 선택합니다.", en: "Select seeding/watering/inspection mode." } },
              { title: { ko: "일정 등록", en: "Schedule" }, desc: { ko: "원하는 시간에 자동 작업을 예약하세요.", en: "Schedule automatic tasks at your preferred time." } },
            ],
          },
          {
            type: "bullets",
            title: { ko: "주의사항", en: "Caution" },
            items: [
              { ko: "진흙/수분이 많은 구역에서는 속도를 낮추세요.", en: "Reduce speed in muddy or wet areas." },
              { ko: "센서 오염 시 인식 성능이 저하될 수 있습니다.", en: "Dirty sensors may reduce detection performance." },
            ],
          },
        ],
      },
    },

    {
      name: { ko: "펫케어 로봇 플래피", en: "PetCare Robot Flappy" },
      price: 789000,
      description: {
        ko: "반려동물 돌봄 전용 로봇. 자동 급식, 놀이, 건강 모니터링까지 한 번에!",
        en: "Robot dedicated to pet care. Automatic feeding, play, and health monitoring all in one!",
      },
      images: [
        "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=500",
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500",
      ],
      stock: 34,
      category: { ko: "펫케어로봇", en: "Pet Care Robot" },

      features: {
        items: [
          { icon: "smartphone", title: { ko: "급식 스케줄", en: "Feeding schedule" }, desc: { ko: "앱에서 자동 급식 시간을 설정할 수 있습니다.", en: "Set automatic feeding schedules in the app." } },
          { icon: "camera", title: { ko: "실시간 확인", en: "Live view" }, desc: { ko: "외출 중에도 반려동물을 영상으로 확인합니다.", en: "Check your pet with live video while away." } },
          { icon: "mic", title: { ko: "양방향 대화", en: "Two-way talk" }, desc: { ko: "음성으로 반려동물에게 말을 걸 수 있습니다.", en: "Talk to your pet with two-way audio." } },
          { icon: "speaker", title: { ko: "알림/경고", en: "Alerts" }, desc: { ko: "활동/급식/이상 징후를 알림으로 알려줍니다.", en: "Alerts you about activity, feeding, and anomalies." } },
        ],
      },
      detailInfo: {
        maker: "RoboTech Industries",
        origin: { ko: "대한민국", en: "Korea" },
        warranty: { ko: "구입일로부터 1년", en: "1 year from purchase" },
        as: { ko: "RoboTech 고객센터 (1588-0000)", en: "RoboTech Support Center (+82-1588-0000)" },
        cert: "R-R-RBT-FLAPPY-2025",
      },
      specs: {
        basic: {
          size: { ko: "260 x 210 x 360 mm", en: "260 x 210 x 360 mm" },
          weight: { ko: "3.0 kg", en: "3.0 kg" },
          connect: { ko: "Wi-Fi 6, Bluetooth", en: "Wi-Fi 6, Bluetooth" },
          camera: { ko: "1080p, 120°", en: "1080p, 120°" },
          mic: { ko: "노이즈 캔슬링 마이크", en: "Noise cancelling mic" },
          speaker: { ko: "15W", en: "15W" },
        },
        performance: {
          cpu: { ko: "Quad-core", en: "Quad-core" },
          ram: { ko: "4GB", en: "4GB" },
          storage: { ko: "32GB", en: "32GB" },
          battery: { ko: "최대 8시간", en: "Up to 8 hours" },
          charge: { ko: "USB-C 고속 충전", en: "USB-C fast charging" },
          os: { ko: "RoboOS Care", en: "RoboOS Care" },
        },
        support: [
          { ko: "자동 급식", en: "Auto feeding" },
          { ko: "놀이 모드", en: "Play mode" },
          { ko: "건강/활동 알림", en: "Health & activity alerts" },
          { ko: "원격 영상/통화", en: "Remote video & talk" },
        ],
      },
      guide: {
        sections: [
          {
            type: "steps",
            title: { ko: "시작하기", en: "Getting started" },
            items: [
              { title: { ko: "사료통 장착", en: "Load food" }, desc: { ko: "사료통을 열고 사료를 넣은 뒤 잠금 상태를 확인하세요.", en: "Fill the food container and ensure it is locked." } },
              { title: { ko: "급식 시간 설정", en: "Set schedule" }, desc: { ko: "앱에서 급식 시간을 등록합니다.", en: "Set feeding schedules in the app." } },
              { title: { ko: "카메라 위치 조정", en: "Adjust camera" }, desc: { ko: "반려동물이 잘 보이는 위치로 배치하세요.", en: "Place it where your pet is clearly visible." } },
            ],
          },
          {
            type: "bullets",
            title: { ko: "주의사항", en: "Caution" },
            items: [
              { ko: "사료통은 정기적으로 세척해주세요.", en: "Clean the food container regularly." },
              { ko: "물기 많은 곳/직사광선은 피하세요.", en: "Avoid wet areas and direct sunlight." },
            ],
          },
        ],
      },
    },

    {
      name: { ko: "휴머노이드 아시모 2.0", en: "Humanoid ASIMO 2.0" },
      price: 12900000,
      description: {
        ko: "차세대 휴머노이드 로봇. 인간과 유사한 움직임과 상호작용이 가능한 미래형 로봇입니다.",
        en: "Next-generation humanoid robot. Capable of human-like movement and interaction.",
      },
      images: [
        "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=500",
        "https://images.unsplash.com/photo-1630505331189-4ca903b81824?w=500",
      ],
      stock: 3,
      category: { ko: "휴머노이드", en: "Humanoid" },

      features: {
        items: [
          { icon: "camera", title: { ko: "AI 비전", en: "AI vision" }, desc: { ko: "사람/장애물을 인식하고 상황을 판단합니다.", en: "Recognizes people/obstacles and understands context." } },
          { icon: "mic", title: { ko: "자연어 대화", en: "Natural language" }, desc: { ko: "자연어 처리 기반으로 대화와 안내가 가능합니다.", en: "Conversational guidance powered by natural language processing." } },
          { icon: "speaker", title: { ko: "고품질 스피커", en: "High-quality audio" }, desc: { ko: "안내/음악/통화 등 다양한 음향 기능을 제공합니다.", en: "Provides guidance, music, and call-quality audio." } },
          { icon: "smartphone", title: { ko: "원격 제어", en: "Remote control" }, desc: { ko: "앱에서 동작/모드/상태를 관리합니다.", en: "Manage actions, modes, and status via the app." } },
        ],
      },
      detailInfo: {
        maker: "RoboTech Industries",
        origin: { ko: "대한민국", en: "Korea" },
        warranty: { ko: "구입일로부터 1년", en: "1 year from purchase" },
        as: { ko: "RoboTech 고객센터 (1588-0000)", en: "RoboTech Support Center (+82-1588-0000)" },
        cert: "R-R-RBT-ASIMO-2025",
      },
      specs: {
        basic: {
          size: { ko: "600 x 450 x 1500 mm", en: "600 x 450 x 1500 mm" },
          weight: { ko: "48 kg", en: "48 kg" },
          connect: { ko: "Wi-Fi 6E, Bluetooth 5.3", en: "Wi-Fi 6E, Bluetooth 5.3" },
          camera: { ko: "4K 듀얼 카메라", en: "4K dual camera" },
          mic: { ko: "6-마이크 어레이", en: "6-mic array" },
          speaker: { ko: "50W", en: "50W" },
        },
        performance: {
          cpu: { ko: "AI Compute Module", en: "AI Compute Module" },
          ram: { ko: "16GB", en: "16GB" },
          storage: { ko: "512GB", en: "512GB" },
          battery: { ko: "최대 6시간", en: "Up to 6 hours" },
          charge: { ko: "고속 충전(60분 80%)", en: "Fast charging (80% in 60 min)" },
          os: { ko: "RoboOS 4.0", en: "RoboOS 4.0" },
        },
        support: [
          { ko: "자연어 안내", en: "Natural language guidance" },
          { ko: "인물 추적", en: "Person tracking" },
          { ko: "제스처 인식", en: "Gesture recognition" },
          { ko: "원격 모니터링", en: "Remote monitoring" },
        ],
      },
      guide: {
        sections: [
          {
            type: "steps",
            title: { ko: "초기 셋업", en: "Initial setup" },
            items: [
              { title: { ko: "계정 로그인", en: "Sign in" }, desc: { ko: "전용 앱에서 기기 등록 후 계정에 로그인합니다.", en: "Register the device and sign in via the app." } },
              { title: { ko: "안전 구역 설정", en: "Set safe zones" }, desc: { ko: "동작 구역과 금지 구역을 설정하세요.", en: "Set operating and no-go zones." } },
              { title: { ko: "테스트 동작", en: "Test actions" }, desc: { ko: "기본 이동/안내 동작을 테스트합니다.", en: "Test basic movement and guidance actions." } },
            ],
          },
          {
            type: "bullets",
            title: { ko: "주의사항", en: "Caution" },
            items: [
              { ko: "계단/문턱 등 위험 구역을 금지 구역으로 설정하세요.", en: "Set stairs and hazardous areas as no-go zones." },
              { ko: "관절 부위에 이물질이 끼지 않도록 주의하세요.", en: "Keep joints free of debris." },
            ],
          },
        ],
      },
    },

    {
      name: { ko: "바리스타 로봇 카페마스터", en: "Barista Robot CafeMaster" },
      price: 1890000,
      description: {
        ko: "완벽한 커피를 내려주는 바리스타 로봇. 라떼아트까지 가능한 프로페셔널 로봇입니다.",
        en: "Barista robot that brews perfect coffee. Professional robot capable of latte art.",
      },
      images: [
        "https://plus.unsplash.com/premium_photo-1741636530412-641689accf2b?w=500",
        "https://plus.unsplash.com/premium_photo-1742884841225-7e8961ec3611?w=500",
      ],
      stock: 15,
      category: { ko: "서비스로봇", en: "Service Robot" },

      features: {
        items: [
          { icon: "smartphone", title: { ko: "레시피 관리", en: "Recipe management" }, desc: { ko: "앱에서 메뉴/레시피/샷 설정을 관리합니다.", en: "Manage menus, recipes, and shot settings in the app." } },
          { icon: "mic", title: { ko: "주문 안내", en: "Order guidance" }, desc: { ko: "현장에서 음성으로 진행 상태를 안내합니다.", en: "Provides voice prompts for order status." } },
          { icon: "camera", title: { ko: "품질 체크", en: "Quality check" }, desc: { ko: "추출 상태를 감지해 균일한 품질을 유지합니다.", en: "Detects extraction conditions to keep quality consistent." } },
          { icon: "speaker", title: { ko: "완료 알림", en: "Completion alerts" }, desc: { ko: "제조 완료 알림과 안내음을 제공합니다.", en: "Plays completion notifications and prompts." } },
        ],
      },
      detailInfo: {
        maker: "RoboTech Industries",
        origin: { ko: "대한민국", en: "Korea" },
        warranty: { ko: "구입일로부터 1년", en: "1 year from purchase" },
        as: { ko: "RoboTech 고객센터 (1588-0000)", en: "RoboTech Support Center (+82-1588-0000)" },
        cert: "R-R-RBT-CAFEM-2025",
      },
      specs: {
        basic: {
          size: { ko: "480 x 420 x 620 mm", en: "480 x 420 x 620 mm" },
          weight: { ko: "22 kg", en: "22 kg" },
          connect: { ko: "Wi-Fi, Ethernet", en: "Wi-Fi, Ethernet" },
          camera: { ko: "1080p 상태 감지", en: "1080p status sensing" },
          mic: { ko: "단일 마이크", en: "Single mic" },
          speaker: { ko: "20W", en: "20W" },
        },
        performance: {
          cpu: { ko: "Brew Controller", en: "Brew Controller" },
          ram: { ko: "4GB", en: "4GB" },
          storage: { ko: "64GB", en: "64GB" },
          battery: { ko: "유선 전원", en: "Wired power" },
          charge: { ko: "해당 없음", en: "N/A" },
          os: { ko: "RoboOS Barista", en: "RoboOS Barista" },
        },
        support: [
          { ko: "에스프레소/라떼 메뉴", en: "Espresso/latte menus" },
          { ko: "레시피 프리셋", en: "Recipe presets" },
          { ko: "세척 알림", en: "Cleaning reminders" },
          { ko: "원격 상태 모니터링", en: "Remote status monitoring" },
        ],
      },
      guide: {
        sections: [
          {
            type: "steps",
            title: { ko: "시작하기", en: "Getting started" },
            items: [
              { title: { ko: "물/원두 세팅", en: "Set water & beans" }, desc: { ko: "물탱크와 원두통을 채운 뒤 장착하세요.", en: "Fill and attach the water tank and bean hopper." } },
              { title: { ko: "레시피 선택", en: "Choose recipe" }, desc: { ko: "앱에서 레시피 프리셋을 선택합니다.", en: "Select a recipe preset in the app." } },
              { title: { ko: "첫 추출", en: "First brew" }, desc: { ko: "테스트 추출로 맛/농도를 조정하세요.", en: "Run a test brew and adjust taste/strength." } },
            ],
          },
          {
            type: "bullets",
            title: { ko: "주의사항", en: "Caution" },
            items: [
              { ko: "세척 주기를 지켜 위생을 유지하세요.", en: "Follow cleaning cycles to maintain hygiene." },
              { ko: "고온 부위(보일러/노즐)에 접촉하지 마세요.", en: "Avoid contact with hot parts (boiler/nozzle)." },
            ],
          },
        ],
      },
    },

    {
      name: { ko: "미니 드론로봇 버디", en: "Mini Drone Robot Buddy" },
      price: 329000,
      description: {
        ko: "실내용 미니 드론 로봇. 귀여운 외형과 다양한 기능으로 온 가족이 즐길 수 있습니다.",
        en: "Indoor mini drone robot. Cute design with various features for the whole family.",
      },
      images: [
        "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500",
        "https://images.unsplash.com/photo-1506947411487-a56738267384?w=500",
      ],
      stock: 67,
      category: { ko: "드론로봇", en: "Drone Robot" },

      features: {
        items: [
          { icon: "camera", title: { ko: "실내 비행", en: "Indoor flight" }, desc: { ko: "안정적인 호버링으로 실내에서도 쉽게 조작합니다.", en: "Stable hovering makes indoor flying easy." } },
          { icon: "smartphone", title: { ko: "앱 조종", en: "App control" }, desc: { ko: "스마트폰으로 조종/모드를 전환합니다.", en: "Control and switch modes from your phone." } },
          { icon: "mic", title: { ko: "음성 트리거", en: "Voice trigger" }, desc: { ko: "간단한 음성 명령으로 모드를 실행합니다.", en: "Run modes with simple voice triggers." } },
          { icon: "speaker", title: { ko: "효과음", en: "Sound effects" }, desc: { ko: "비행 모드별 효과음을 제공합니다.", en: "Plays sound effects for each flight mode." } },
        ],
      },
      detailInfo: {
        maker: "RoboTech Industries",
        origin: { ko: "대한민국", en: "Korea" },
        warranty: { ko: "구입일로부터 1년", en: "1 year from purchase" },
        as: { ko: "RoboTech 고객센터 (1588-0000)", en: "RoboTech Support Center (+82-1588-0000)" },
        cert: "R-R-RBT-BUDDY-2025",
      },
      specs: {
        basic: {
          size: { ko: "110 x 110 x 45 mm", en: "110 x 110 x 45 mm" },
          weight: { ko: "180 g", en: "180 g" },
          connect: { ko: "Wi-Fi Direct, Bluetooth", en: "Wi-Fi Direct, Bluetooth" },
          camera: { ko: "1080p", en: "1080p" },
          mic: { ko: "단일 마이크", en: "Single mic" },
          speaker: { ko: "3W", en: "3W" },
        },
        performance: {
          cpu: { ko: "Flight Controller", en: "Flight Controller" },
          ram: { ko: "1GB", en: "1GB" },
          storage: { ko: "8GB", en: "8GB" },
          battery: { ko: "최대 15분", en: "Up to 15 minutes" },
          charge: { ko: "USB-C", en: "USB-C" },
          os: { ko: "RoboOS Flight", en: "RoboOS Flight" },
        },
        support: [
          { ko: "호버링 안정화", en: "Hover stabilization" },
          { ko: "원터치 이착륙", en: "One-touch takeoff/land" },
          { ko: "사진/영상 촬영", en: "Photo/video capture" },
          { ko: "실내 경로 비행", en: "Indoor route flight" },
        ],
      },
      guide: {
        sections: [
          {
            type: "steps",
            title: { ko: "비행 준비", en: "Flight prep" },
            items: [
              { title: { ko: "프로펠러 확인", en: "Check propellers" }, desc: { ko: "프로펠러가 단단히 고정되어 있는지 확인하세요.", en: "Ensure propellers are securely attached." } },
              { title: { ko: "안전거리 확보", en: "Clear area" }, desc: { ko: "실내 장애물과 사람으로부터 거리를 확보하세요.", en: "Keep distance from obstacles and people." } },
              { title: { ko: "원터치 이륙", en: "One-touch takeoff" }, desc: { ko: "앱에서 이륙 버튼을 눌러 시작합니다.", en: "Press takeoff in the app to start." } },
            ],
          },
          {
            type: "bullets",
            title: { ko: "주의사항", en: "Caution" },
            items: [
              { ko: "어린이는 보호자 지도하에 사용하세요.", en: "Children should use under adult supervision." },
              { ko: "얼굴 가까이 비행하지 마세요.", en: "Do not fly close to faces." },
            ],
          },
        ],
      },
    },

    {
      name: { ko: "의료지원 로봇 케어플러스", en: "Medical Support Robot CarePlus" },
      price: 5690000,
      description: {
        ko: "병원과 요양원을 위한 의료지원 로봇. 환자 모니터링과 기본적인 의료 보조 업무를 수행합니다.",
        en: "Medical support robot for hospitals and nursing homes. Performs patient monitoring and basic medical assistance.",
      },
      images: [
        "https://images.unsplash.com/photo-1717347424091-08275b73c918?w=500",
        "https://plus.unsplash.com/premium_photo-1680700308578-b40c7418e997?w=500",
      ],
      stock: 9,
      category: { ko: "의료로봇", en: "Medical Robot" },

      features: {
        items: [
          { icon: "camera", title: { ko: "상태 모니터링", en: "Patient monitoring" }, desc: { ko: "병실/공간을 모니터링하고 이상 징후를 감지합니다.", en: "Monitors rooms and detects anomalies." } },
          { icon: "smartphone", title: { ko: "원격 협진", en: "Remote assistance" }, desc: { ko: "원격에서 영상 통화로 환자 상태를 확인합니다.", en: "Check patient status via remote video calls." } },
          { icon: "mic", title: { ko: "음성 안내", en: "Voice guidance" }, desc: { ko: "약 복용/안내 방송 등 음성 안내가 가능합니다.", en: "Voice prompts for medication and announcements." } },
          { icon: "speaker", title: { ko: "알림", en: "Alerts" }, desc: { ko: "긴급 상황을 빠르게 알립니다.", en: "Notifies quickly in emergencies." } },
        ],
      },
      detailInfo: {
        maker: "RoboTech Industries",
        origin: { ko: "대한민국", en: "Korea" },
        warranty: { ko: "구입일로부터 1년", en: "1 year from purchase" },
        as: { ko: "RoboTech 고객센터 (1588-0000)", en: "RoboTech Support Center (+82-1588-0000)" },
        cert: "R-R-RBT-CAREPLUS-2025",
      },
      specs: {
        basic: {
          size: { ko: "520 x 480 x 1350 mm", en: "520 x 480 x 1350 mm" },
          weight: { ko: "28 kg", en: "28 kg" },
          connect: { ko: "Wi-Fi 6, LTE", en: "Wi-Fi 6, LTE" },
          camera: { ko: "4K, 120°", en: "4K, 120°" },
          mic: { ko: "4-마이크 어레이", en: "4-mic array" },
          speaker: { ko: "35W", en: "35W" },
        },
        performance: {
          cpu: { ko: "Medical Edge AI", en: "Medical Edge AI" },
          ram: { ko: "8GB", en: "8GB" },
          storage: { ko: "256GB", en: "256GB" },
          battery: { ko: "최대 12시간", en: "Up to 12 hours" },
          charge: { ko: "자동 도킹 충전", en: "Auto docking charge" },
          os: { ko: "RoboOS Care", en: "RoboOS Care" },
        },
        support: [
          { ko: "원격 화상 통화", en: "Remote video calls" },
          { ko: "안내 방송", en: "Announcements" },
          { ko: "상태 모니터링", en: "Status monitoring" },
          { ko: "긴급 알림", en: "Emergency alerts" },
        ],
      },
      guide: {
        sections: [
          {
            type: "steps",
            title: { ko: "운영 시작", en: "Start operation" },
            items: [
              { title: { ko: "와이파이 설정", en: "Set Wi-Fi" }, desc: { ko: "병원 네트워크에 연결하고 접근 권한을 설정하세요.", en: "Connect to the hospital network and set permissions." } },
              { title: { ko: "병실 등록", en: "Register rooms" }, desc: { ko: "모니터링할 병실/구역을 등록합니다.", en: "Register rooms/zones to monitor." } },
              { title: { ko: "알림 수신자 설정", en: "Set recipients" }, desc: { ko: "알림을 받을 담당자/기기를 지정합니다.", en: "Assign staff/devices to receive alerts." } },
            ],
          },
          {
            type: "bullets",
            title: { ko: "주의사항", en: "Caution" },
            items: [
              { ko: "의료 환경에서는 개인정보/보안 정책을 준수하세요.", en: "Follow privacy and security policies in medical environments." },
              { ko: "장비와 케이블이 있는 구역은 금지 구역으로 설정하세요.", en: "Set equipment/cable areas as no-go zones." },
            ],
          },
        ],
      },
    },

    {
      name: { ko: "창고로봇 로지스틱스 프로", en: "Warehouse Robot Logistics Pro" },
      price: 2390000,
      description: {
        ko: "물류창고 자동화를 위한 AGV 로봇. 효율적인 상품 이동과 재고관리를 제공합니다.",
        en: "AGV robot for warehouse automation. Provides efficient product transport and inventory management.",
      },
      images: [
        "https://images.unsplash.com/photo-1589254065909-b7086229d08c?w=500",
        "https://images.unsplash.com/photo-1589254066213-a0c9dc853511?w=500",
      ],
      stock: 18,
      category: { ko: "물류로봇", en: "Logistics Robot" },

      features: {
        items: [
          { icon: "camera", title: { ko: "경로 최적화", en: "Route optimization" }, desc: { ko: "혼잡도에 따라 최적 경로로 이동합니다.", en: "Moves via optimized routes based on congestion." } },
          { icon: "smartphone", title: { ko: "플릿 관리", en: "Fleet management" }, desc: { ko: "여러 대를 한 화면에서 모니터링/제어합니다.", en: "Monitor and control multiple robots in one view." } },
          { icon: "mic", title: { ko: "현장 안내", en: "On-site prompts" }, desc: { ko: "작업 상태를 음성으로 안내합니다.", en: "Announces task status via voice." } },
          { icon: "speaker", title: { ko: "안전 알림", en: "Safety alerts" }, desc: { ko: "경고음/알림으로 안전을 강화합니다.", en: "Enhances safety with alarms and prompts." } },
        ],
      },
      detailInfo: {
        maker: "RoboTech Industries",
        origin: { ko: "대한민국", en: "Korea" },
        warranty: { ko: "구입일로부터 1년", en: "1 year from purchase" },
        as: { ko: "RoboTech 고객센터 (1588-0000)", en: "RoboTech Support Center (+82-1588-0000)" },
        cert: "R-R-RBT-LOGI-2025",
      },
      specs: {
        basic: {
          size: { ko: "780 x 580 x 320 mm", en: "780 x 580 x 320 mm" },
          weight: { ko: "35 kg", en: "35 kg" },
          connect: { ko: "Wi-Fi, Ethernet", en: "Wi-Fi, Ethernet" },
          camera: { ko: "Depth 센서", en: "Depth sensor" },
          mic: { ko: "해당 없음", en: "N/A" },
          speaker: { ko: "20W", en: "20W" },
        },
        performance: {
          cpu: { ko: "AGV Controller", en: "AGV Controller" },
          ram: { ko: "8GB", en: "8GB" },
          storage: { ko: "128GB", en: "128GB" },
          battery: { ko: "최대 18시간", en: "Up to 18 hours" },
          charge: { ko: "자동 도킹 충전", en: "Auto docking charge" },
          os: { ko: "RoboOS Logistics", en: "RoboOS Logistics" },
        },
        support: [
          { ko: "재고 이동", en: "Inventory transport" },
          { ko: "구역/경로 관리", en: "Zone & route management" },
          { ko: "플릿 모니터링", en: "Fleet monitoring" },
          { ko: "충돌 방지", en: "Collision avoidance" },
        ],
      },
      guide: {
        sections: [
          {
            type: "steps",
            title: { ko: "도입 설정", en: "Deployment setup" },
            items: [
              { title: { ko: "창고 맵 등록", en: "Register map" }, desc: { ko: "주행 구역과 랙/통로를 등록합니다.", en: "Register driving zones and aisles." } },
              { title: { ko: "피킹 포인트 설정", en: "Set picking points" }, desc: { ko: "상/하차 지점을 지정합니다.", en: "Assign loading/unloading points." } },
              { title: { ko: "테스트 라운드", en: "Test round" }, desc: { ko: "실제 동선으로 테스트해 최적화합니다.", en: "Test with real routes and optimize." } },
            ],
          },
          {
            type: "bullets",
            title: { ko: "주의사항", en: "Caution" },
            items: [
              { ko: "사람 이동이 많은 구역은 속도를 낮추세요.", en: "Lower speed in high-traffic human areas." },
              { ko: "바닥 턱/요철 구역은 금지 구역으로 설정하세요.", en: "Set rough floor areas as no-go zones." },
            ],
          },
        ],
      },
    },

    {
      name: { ko: "댄싱로봇 리듬이", en: "Dancing Robot Rhythm" },
      price: 599000,
      description: {
        ko: "음악에 맞춰 춤추는 엔터테인먼트 로봇. 파티와 이벤트를 더욱 즐겁게 만들어줍니다.",
        en: "Entertainment robot that dances to music. Makes parties and events more fun.",
      },
      images: [
        "https://images.unsplash.com/photo-1707948952408-f7aa2c51db1f?w=500",
        "https://images.unsplash.com/photo-1538491247542-5da27794bc65?w=500",
      ],
      stock: 52,
      category: { ko: "엔터테인먼트", en: "Entertainment" },

      features: {
        items: [
          { icon: "speaker", title: { ko: "음악 재생", en: "Music playback" }, desc: { ko: "다양한 장르의 음악과 함께 춤을 춥니다.", en: "Plays music and dances across various genres." } },
          { icon: "mic", title: { ko: "비트 인식", en: "Beat detection" }, desc: { ko: "실시간으로 비트를 분석해 동작을 동기화합니다.", en: "Analyzes beats in real time to sync motions." } },
          { icon: "camera", title: { ko: "포즈 촬영", en: "Pose capture" }, desc: { ko: "춤 추는 순간을 사진으로 남길 수 있습니다.", en: "Capture moments with photos while dancing." } },
          { icon: "smartphone", title: { ko: "댄스 모드", en: "Dance modes" }, desc: { ko: "앱에서 댄스 모드를 선택하고 커스텀합니다.", en: "Choose and customize dance modes in the app." } },
        ],
      },
      detailInfo: {
        maker: "RoboTech Industries",
        origin: { ko: "대한민국", en: "Korea" },
        warranty: { ko: "구입일로부터 1년", en: "1 year from purchase" },
        as: { ko: "RoboTech 고객센터 (1588-0000)", en: "RoboTech Support Center (+82-1588-0000)" },
        cert: "R-R-RBT-RHYTHM-2025",
      },
      specs: {
        basic: {
          size: { ko: "250 x 220 x 420 mm", en: "250 x 220 x 420 mm" },
          weight: { ko: "3.8 kg", en: "3.8 kg" },
          connect: { ko: "Wi-Fi, Bluetooth", en: "Wi-Fi, Bluetooth" },
          camera: { ko: "1080p", en: "1080p" },
          mic: { ko: "듀얼 마이크", en: "Dual mic" },
          speaker: { ko: "25W", en: "25W" },
        },
        performance: {
          cpu: { ko: "Motion Controller", en: "Motion Controller" },
          ram: { ko: "4GB", en: "4GB" },
          storage: { ko: "32GB", en: "32GB" },
          battery: { ko: "최대 7시간", en: "Up to 7 hours" },
          charge: { ko: "USB-C", en: "USB-C" },
          os: { ko: "RoboOS Fun", en: "RoboOS Fun" },
        },
        support: [
          { ko: "자동 댄스", en: "Auto dance" },
          { ko: "음악 스트리밍", en: "Music streaming" },
          { ko: "포즈 촬영", en: "Pose photos" },
          { ko: "댄스 커스텀", en: "Dance customization" },
        ],
      },
      guide: {
        sections: [
          {
            type: "steps",
            title: { ko: "첫 댄스", en: "First dance" },
            items: [
              { title: { ko: "모드 선택", en: "Choose mode" }, desc: { ko: "앱에서 댄스 모드를 선택하세요.", en: "Choose a dance mode in the app." } },
              { title: { ko: "음악 연결", en: "Connect music" }, desc: { ko: "블루투스/스트리밍으로 음악을 재생합니다.", en: "Play music via Bluetooth or streaming." } },
              { title: { ko: "공간 확보", en: "Clear space" }, desc: { ko: "주변 장애물을 치우고 안전 거리를 확보하세요.", en: "Remove obstacles and keep a safe distance." } },
            ],
          },
          {
            type: "bullets",
            title: { ko: "주의사항", en: "Caution" },
            items: [
              { ko: "미끄러운 바닥에서는 사용을 피하세요.", en: "Avoid using on slippery floors." },
              { ko: "작동 중 로봇을 들어올리지 마세요.", en: "Do not lift the robot while operating." },
            ],
          },
        ],
      },
    },

    {
      name: { ko: "스마트홈 허브로봇 홈이", en: "Smart Home Hub Robot Homey" },
      price: 889000,
      description: {
        ko: "집안의 모든 IoT 기기를 제어하는 중앙 허브 로봇. 음성 명령으로 스마트홈을 완성하세요.",
        en: "Central hub robot controlling all IoT devices at home. Complete your smart home with voice commands.",
      },
      images: [
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500",
        "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=500",
      ],
      stock: 41,
      category: { ko: "스마트홈", en: "Smart Home" },

      features: {
        items: [
          { icon: "mic", title: { ko: "음성 제어", en: "Voice control" }, desc: { ko: "음성 명령으로 조명/에어컨/가전을 제어합니다.", en: "Control lights, AC, and appliances with voice commands." } },
          { icon: "smartphone", title: { ko: "기기 통합", en: "Device integration" }, desc: { ko: "다양한 IoT 기기를 한 앱에서 관리합니다.", en: "Manage multiple IoT devices in one app." } },
          { icon: "speaker", title: { ko: "알림/방송", en: "Announcements" }, desc: { ko: "일정/날씨/뉴스 알림을 안내합니다.", en: "Announces schedules, weather, and news." } },
          { icon: "camera", title: { ko: "홈 모니터링", en: "Home monitoring" }, desc: { ko: "집안을 카메라로 확인하고 이벤트를 기록합니다.", en: "Monitors home and records events via camera." } },
        ],
      },
      detailInfo: {
        maker: "RoboTech Industries",
        origin: { ko: "대한민국", en: "Korea" },
        warranty: { ko: "구입일로부터 1년", en: "1 year from purchase" },
        as: { ko: "RoboTech 고객센터 (1588-0000)", en: "RoboTech Support Center (+82-1588-0000)" },
        cert: "R-R-RBT-HOMEY-2025",
      },
      specs: {
        basic: {
          size: { ko: "300 x 260 x 420 mm", en: "300 x 260 x 420 mm" },
          weight: { ko: "3.5 kg", en: "3.5 kg" },
          connect: { ko: "Wi-Fi 6, Bluetooth 5.2", en: "Wi-Fi 6, Bluetooth 5.2" },
          camera: { ko: "2K, 120°", en: "2K, 120°" },
          mic: { ko: "4-마이크 어레이", en: "4-mic array" },
          speaker: { ko: "30W", en: "30W" },
        },
        performance: {
          cpu: { ko: "Smart Hub SoC", en: "Smart Hub SoC" },
          ram: { ko: "8GB", en: "8GB" },
          storage: { ko: "128GB", en: "128GB" },
          battery: { ko: "최대 9시간", en: "Up to 9 hours" },
          charge: { ko: "자동 도킹 충전", en: "Auto docking charge" },
          os: { ko: "RoboOS Home", en: "RoboOS Home" },
        },
        support: [
          { ko: "스마트홈 기기 통합", en: "Smart device integration" },
          { ko: "음성 명령 제어", en: "Voice command control" },
          { ko: "날씨/뉴스 알림", en: "Weather/news alerts" },
          { ko: "일정/리마인더", en: "Schedules & reminders" },
        ],
      },
      guide: {
        sections: [
          {
            type: "steps",
            title: { ko: "연동하기", en: "Connect devices" },
            items: [
              { title: { ko: "기기 추가", en: "Add devices" }, desc: { ko: "앱에서 IoT 기기를 검색해 추가합니다.", en: "Discover and add IoT devices in the app." } },
              { title: { ko: "룸 설정", en: "Set rooms" }, desc: { ko: "거실/침실 등 룸으로 묶어 관리하세요.", en: "Group devices by rooms like living room/bedroom." } },
              { title: { ko: "음성 명령", en: "Voice commands" }, desc: { ko: "자주 쓰는 명령을 즐겨찾기로 등록하세요.", en: "Save common commands as favorites." } },
            ],
          },
          {
            type: "bullets",
            title: { ko: "주의사항", en: "Caution" },
            items: [
              { ko: "공유기/네트워크 변경 시 재연동이 필요할 수 있습니다.", en: "Re-connecting may be needed after router/network changes." },
              { ko: "기기 호환 목록을 확인하세요.", en: "Check the device compatibility list." },
            ],
          },
        ],
      },
    },

    {
      name: { ko: "루미 청소로봇 AI+", en: "Lumi Cleaning Robot AI+" },
      price: 649000,
      description: {
        ko: "AI 매핑과 장애물 회피 기술을 탑재한 프리미엄 로봇청소기. 완벽한 청소를 경험하세요.",
        en: "Premium robotic vacuum with AI mapping and obstacle avoidance technology. Experience perfect cleaning.",
      },
      images: [
        "https://images.unsplash.com/photo-1762500824496-9094f37873c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwcm9ib3R8ZW58MXx8fHwxNzY4MzY5MDA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1754297813495-b1b4d20b8a11?w=500",
        "https://images.unsplash.com/photo-1699602048528-5311af9da7f6?w=500",
      ],
      stock: 78,
      category: { ko: "청소로봇", en: "Cleaning Robot" },

      features: {
        items: [
          { icon: "camera", title: { ko: "AI 매핑", en: "AI mapping" }, desc: { ko: "집 구조를 학습해 효율적인 청소 경로를 만듭니다.", en: "Learns your home to create efficient cleaning paths." } },
          { icon: "smartphone", title: { ko: "구역 청소", en: "Zone cleaning" }, desc: { ko: "앱에서 구역을 선택해 원하는 곳만 청소합니다.", en: "Select zones in the app to clean specific areas." } },
          { icon: "speaker", title: { ko: "상태 안내", en: "Status prompts" }, desc: { ko: "청소 진행 상태를 음성으로 안내합니다.", en: "Provides voice prompts for cleaning status." } },
          { icon: "mic", title: { ko: "음성 명령", en: "Voice commands" }, desc: { ko: "간단한 음성 명령으로 청소를 시작/중지합니다.", en: "Start/stop cleaning with simple voice commands." } },
        ],
      },
      detailInfo: {
        maker: "RoboTech Industries",
        origin: { ko: "대한민국", en: "Korea" },
        warranty: { ko: "구입일로부터 1년", en: "1 year from purchase" },
        as: { ko: "RoboTech 고객센터 (1588-0000)", en: "RoboTech Support Center (+82-1588-0000)" },
        cert: "R-R-RBT-LUMI-2025",
      },
      specs: {
        basic: {
          size: { ko: "350 x 350 x 98 mm", en: "350 x 350 x 98 mm" },
          weight: { ko: "3.4 kg", en: "3.4 kg" },
          connect: { ko: "Wi-Fi 6, Bluetooth", en: "Wi-Fi 6, Bluetooth" },
          camera: { ko: "VSLAM 센서", en: "VSLAM sensor" },
          mic: { ko: "듀얼 마이크", en: "Dual mic" },
          speaker: { ko: "5W", en: "5W" },
        },
        performance: {
          cpu: { ko: "Navigation SoC", en: "Navigation SoC" },
          ram: { ko: "4GB", en: "4GB" },
          storage: { ko: "16GB", en: "16GB" },
          battery: { ko: "최대 3시간", en: "Up to 3 hours" },
          charge: { ko: "자동 도킹 충전", en: "Auto docking charge" },
          os: { ko: "RoboOS Clean", en: "RoboOS Clean" },
        },
        support: [
          { ko: "AI 매핑", en: "AI mapping" },
          { ko: "구역/금지 구역 설정", en: "Zone & no-go settings" },
          { ko: "스케줄 청소", en: "Scheduled cleaning" },
          { ko: "물걸레(옵션)", en: "Mopping (optional)" },
        ],
      },
      guide: {
        sections: [
          {
            type: "steps",
            title: { ko: "시작하기", en: "Getting started" },
            items: [
              { title: { ko: "도크 설치", en: "Install dock" }, desc: { ko: "벽과 충분한 간격을 두고 도크를 설치하세요.", en: "Install the dock with enough clearance from walls." } },
              { title: { ko: "맵 생성", en: "Create map" }, desc: { ko: "처음 1회 전체 공간을 주행해 맵을 생성합니다.", en: "Run once to create a full map of your space." } },
              { title: { ko: "스케줄 설정", en: "Set schedule" }, desc: { ko: "앱에서 자동 청소 시간을 설정합니다.", en: "Set automatic cleaning schedules in the app." } },
            ],
          },
          {
            type: "cards",
            title: { ko: "빠른 실행", en: "Quick actions" },
            items: [
              { cmd: { ko: "전체 청소", en: "Full clean" }, desc: { ko: "전 구역 청소를 시작합니다.", en: "Starts full-area cleaning." } },
              { cmd: { ko: "도크 복귀", en: "Return to dock" }, desc: { ko: "충전 도크로 복귀합니다.", en: "Returns to the charging dock." } },
              { cmd: { ko: "집중 청소", en: "Spot clean" }, desc: { ko: "지정 구역을 집중 청소합니다.", en: "Cleans a designated spot intensely." } },
              { cmd: { ko: "일시정지", en: "Pause" }, desc: { ko: "현재 동작을 일시정지합니다.", en: "Pauses current operation." } },
            ],
          },
          {
            type: "bullets",
            title: { ko: "주의사항", en: "Caution" },
            items: [
              { ko: "바닥의 전선/작은 물건을 정리한 후 사용하세요.", en: "Remove cables and small objects before use." },
              { ko: "물걸레 사용 시 카펫 구역을 금지 구역으로 설정하세요.", en: "Set carpets as no-go zones when mopping." },
            ],
          },
        ],
      },
    },

    {
      name: { ko: "배달로봇 딜리버리 원", en: "Delivery Robot Delivery One" },
      price: 1490000,
      description: {
        ko: "무인 배달 서비스를 위한 자율주행 배달로봇. 안전하고 신속한 배달을 보장합니다.",
        en: "Autonomous delivery robot for unmanned delivery service. Ensures safe and fast delivery.",
      },
      images: [
        "https://images.unsplash.com/photo-1602096711412-af3596c8e395?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHJvYm90fGVufDF8fHx8MTc2ODM2OTAwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://plus.unsplash.com/premium_photo-1756908689167-fc8d92b3a9e1?w=500",
        "https://images.unsplash.com/photo-1722452323413-b8f5447d4c41?w=500",
      ],
      stock: 23,
      category: { ko: "배달로봇", en: "Delivery Robot" },

      features: {
        items: [
          { icon: "camera", title: { ko: "자율주행 배달", en: "Autonomous delivery" }, desc: { ko: "실시간 경로 최적화로 안전하게 배송합니다.", en: "Delivers safely with real-time route optimization." } },
          { icon: "smartphone", title: { ko: "배달 관리", en: "Delivery management" }, desc: { ko: "주문/상태/도착 알림을 앱에서 관리합니다.", en: "Manage orders, status, and arrival notifications in the app." } },
          { icon: "speaker", title: { ko: "도착 안내", en: "Arrival prompts" }, desc: { ko: "도착 시 안내 방송과 알림을 제공합니다.", en: "Provides arrival announcements and alerts." } },
          { icon: "mic", title: { ko: "고객 응대", en: "Customer interaction" }, desc: { ko: "간단한 안내/응대를 음성으로 제공합니다.", en: "Offers simple voice guidance and interaction." } },
        ],
      },
      detailInfo: {
        maker: "RoboTech Industries",
        origin: { ko: "대한민국", en: "Korea" },
        warranty: { ko: "구입일로부터 1년", en: "1 year from purchase" },
        as: { ko: "RoboTech 고객센터 (1588-0000)", en: "RoboTech Support Center (+82-1588-0000)" },
        cert: "R-R-RBT-DELIVERY-2025",
      },
      specs: {
        basic: {
          size: { ko: "520 x 520 x 980 mm", en: "520 x 520 x 980 mm" },
          weight: { ko: "32 kg", en: "32 kg" },
          connect: { ko: "Wi-Fi, LTE", en: "Wi-Fi, LTE" },
          camera: { ko: "2K, 140°", en: "2K, 140°" },
          mic: { ko: "듀얼 마이크", en: "Dual mic" },
          speaker: { ko: "25W", en: "25W" },
        },
        performance: {
          cpu: { ko: "Navigation Controller", en: "Navigation Controller" },
          ram: { ko: "8GB", en: "8GB" },
          storage: { ko: "128GB", en: "128GB" },
          battery: { ko: "최대 10시간", en: "Up to 10 hours" },
          charge: { ko: "자동 도킹/유선 충전", en: "Auto docking / wired charging" },
          os: { ko: "RoboOS Delivery", en: "RoboOS Delivery" },
        },
        support: [
          { ko: "자율주행 배송", en: "Autonomous delivery" },
          { ko: "실시간 추적", en: "Real-time tracking" },
          { ko: "도착 알림", en: "Arrival alerts" },
          { ko: "구역 제한", en: "Zone restrictions" },
        ],
      },
      guide: {
        sections: [
          {
            type: "steps",
            title: { ko: "운영 시작", en: "Start operation" },
            items: [
              { title: { ko: "배송 구역 등록", en: "Register delivery area" }, desc: { ko: "서비스 지역과 제한 구역을 설정하세요.", en: "Set service area and restricted zones." } },
              { title: { ko: "픽업/드롭 설정", en: "Set pickup/drop" }, desc: { ko: "픽업 지점과 도착 지점을 등록합니다.", en: "Register pickup and drop-off points." } },
              { title: { ko: "테스트 배송", en: "Test delivery" }, desc: { ko: "혼잡 구간과 경사로를 확인합니다.", en: "Check crowded spots and slopes." } },
            ],
          },
          {
            type: "bullets",
            title: { ko: "주의사항", en: "Caution" },
            items: [
              { ko: "보행자 통행이 많은 구역은 속도를 낮추세요.", en: "Reduce speed in pedestrian-heavy areas." },
              { ko: "우천/눈길 등 미끄러운 환경에서는 사용을 제한하세요.", en: "Limit use in rain/snow or slippery conditions." },
            ],
          },
        ],
      },
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(` ${products.length}개의 로봇 상품이 생성되었습니다.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
