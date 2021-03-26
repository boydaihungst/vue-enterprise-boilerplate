import VuePlyr from 'vue-plyr';
import { Options } from 'plyr';
import 'vue-plyr/dist/vue-plyr.css';
import Vue from 'vue';

/** @type {Options} */
export const plyrDefaultOptions = {
  debug: process.env.NODE_ENV === 'development',
  controls: [
    'play-large',
    'rewind',
    'play',
    'fast-forward',
    'progress',
    'current-time',
    'duration',
    'mute',
    'volume',
    'settings',
    'pip',
    'airplay',
    'download',
    'fullscreen',
  ],
  i18n: {
    restart: 'Phát lại',
    rewind: 'Tua ngược {seektime}s',
    play: 'Phát',
    pause: 'Dừng',
    fastForward: 'Tua nhanh {seektime}s',
    seek: 'Seek',
    seekLabel: '{currentTime} of {duration}',
    played: 'Đã phát',
    buffered: 'Buffered',
    currentTime: 'Thời điểm hiện tại',
    duration: 'Độ dài',
    volume: 'Âm lượng',
    mute: 'Tắt âm thanh',
    unmute: 'Mở âm thanh',
    enableCaptions: 'Bật phụ đề',
    disableCaptions: 'Đóng phụ đề',
    download: 'Tải về',
    enterFullscreen: 'Mở toàn màn hình',
    exitFullscreen: 'Thu nhỏ cửa sổ',
    frameTitle: 'Player for {title}',
    captions: 'Phụ đề',
    settings: 'Cài đặt',
    pip: 'Picture in Picture',
    menuBack: 'Quay lại',
    speed: 'Tốc độ',
    normal: 'Bình thường',
    quality: 'Chất lượng',
    loop: 'Lặp',
    start: 'Bắt đầu',
    end: 'Kết thúc',
    all: 'Tất cả',
    reset: 'Reset',
    disabled: 'Đã tắt',
    enabled: 'Đã bật',
    advertisement: 'Ad',
    qualityBadge: {
      2160: '4K',
      1440: '2K',
      1080: 'FullHD',
      720: 'HD',
      576: 'SD',
      480: 'SD',
    },
  },
  settings: ['captions', 'speed'],
};

const install = () => {
  Vue.use(VuePlyr, {
    plyr: plyrDefaultOptions,
    emit: ['ended', 'canplay', 'loadedmetadata'],
  });
};
export { install };
