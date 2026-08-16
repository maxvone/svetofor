import type { HandSignalPose, HandSignalVisualDefinition } from './types';

function pose(
  prop: HandSignalPose['prop'],
  arm: HandSignalPose['arm'],
  motion: HandSignalPose['motion'],
  caption_ru: string
): HandSignalPose {
  return { prop, arm, motion, caption_ru };
}

function define(
  itemId: string,
  gestureLabel_ru: string,
  day: HandSignalPose,
  night: HandSignalPose
): HandSignalVisualDefinition {
  return { itemId, gestureLabel_ru, day, night };
}

export const handSignalVisuals: Record<string, HandSignalVisualDefinition> = {
  'stop-p59-red': define(
    'stop-p59-red',
    'Красный флаг / красный огонь',
    pose('red_flag', 'raised', 'static', 'Днём — развёрнутый красный флаг'),
    pose('lantern_red', 'raised', 'static', 'Ночью — красный огонь фонаря')
  ),
  'stop-p59-substitute': define(
    'stop-p59-substitute',
    'Заменяющий сигнал остановки',
    pose('yellow_flag_open', 'raised', 'circle', 'Днём — движение по кругу жёлтого флага или руки'),
    pose('lantern_white', 'raised', 'circle', 'Ночью — движение по кругу фонаря')
  ),
  'stop-p61-station-stop': define(
    'stop-p61-station-stop',
    'Остановка поезда дежурным',
    pose('red_flag', 'raised', 'static', 'Днём — красный диск или развёрнутый красный флаг'),
    pose('lantern_red', 'raised', 'static', 'Ночью — красный огонь фонаря')
  ),
  'stop-p64-from-train': define(
    'stop-p64-from-train',
    'Сигнал остановки с поезда',
    pose('red_flag', 'raised', 'static', 'Днём — развёрнутый красный флаг'),
    pose('lantern_red', 'raised', 'static', 'Ночью — красный огонь фонаря')
  ),

  'proceed-p61-depart': define(
    'proceed-p61-depart',
    'Разрешение отправления',
    pose('white_disc', 'raised', 'static', 'Днём — поднятый белый диск или свёрнутый жёлтый флаг'),
    pose('lantern_green', 'raised', 'static', 'Ночью — поднятый фонарь с зелёным огнём')
  ),
  'proceed-p62-pass-through': define(
    'proceed-p62-pass-through',
    'Пропуск без остановки',
    pose('yellow_flag_closed', 'raised', 'static', 'Днём — свёрнутый жёлтый флаг'),
    pose('lantern_white', 'raised', 'static', 'Ночью — прозрачно-белый огонь фонаря')
  ),
  'proceed-p62-side-stop': define(
    'proceed-p62-side-stop',
    'Приём на боковой путь',
    pose('yellow_flag_open', 'raised', 'static', 'Днём — развёрнутый жёлтый флаг'),
    pose('lantern_yellow', 'raised', 'static', 'Ночью — жёлтый огонь фонаря')
  ),
  'proceed-p63-escort': define(
    'proceed-p63-escort',
    'Провожание поезда',
    pose('yellow_flag_closed', 'raised', 'static', 'Днём — свёрнутый жёлтый флаг'),
    pose('lantern_white', 'raised', 'static', 'Ночью — прозрачно-белый огонь фонаря')
  ),

  'speed-p59-yellow-flag': define(
    'speed-p59-yellow-flag',
    'Жёлтый флаг / жёлтый огонь',
    pose('yellow_flag_open', 'raised', 'static', 'Днём — развёрнутый жёлтый флаг'),
    pose('lantern_yellow', 'raised', 'static', 'Ночью — жёлтый огонь фонаря')
  ),
  'speed-p59-white-vertical': define(
    'speed-p59-white-vertical',
    'Фонарь вверх-вниз (станция)',
    pose('hand', 'raised', 'vertical', 'Днём — жёлтый флаг (если есть)'),
    pose('lantern_white', 'raised', 'vertical', 'Ночью — движения фонаря вверх и вниз')
  ),
  'speed-p59-white-open-line': define(
    'speed-p59-white-open-line',
    'Фонарь вверх-вниз (перегон)',
    pose('hand', 'raised', 'vertical', 'На перегоне днём — по местным правилам'),
    pose('lantern_white', 'raised', 'vertical', 'Ночью — движения фонаря вверх и вниз')
  ),

  'shunting-p91-forward': define(
    'shunting-p91-forward',
    'Вперёд (управление)',
    pose('yellow_flag_open', 'raised', 'static', 'Днём — поднятая рука с развёрнутым жёлтым флагом'),
    pose('lantern_white', 'raised', 'static', 'Ночью — поднятый фонарь с белым огнём')
  ),
  'shunting-p91-backward': define(
    'shunting-p91-backward',
    'Назад (управление)',
    pose('yellow_flag_open', 'lowered', 'static', 'Днём — опущенная рука с жёлтым флагом'),
    pose('lantern_white', 'lowered', 'static', 'Ночью — опущенный фонарь')
  ),
  'shunting-p91-slower': define(
    'shunting-p91-slower',
    'Тише',
    pose('yellow_flag_open', 'raised', 'vertical', 'Днём — медленные движения флага вверх-вниз'),
    pose('lantern_white', 'raised', 'vertical', 'Ночью — медленные движения фонаря вверх-вниз')
  ),
  'shunting-p91-stop': define(
    'shunting-p91-stop',
    'Стой (маневр)',
    pose('red_flag', 'raised', 'circle', 'Днём — движения по кругу красного или жёлтого флага'),
    pose('lantern_red', 'raised', 'circle', 'Ночью — движения по кругу фонаря')
  ),

  'auxiliary-p60-brake-test': define(
    'auxiliary-p60-brake-test',
    'Пробное торможение',
    pose('hand', 'raised', 'static', 'Днём — поднятая вертикально рука'),
    pose('lantern_white', 'raised', 'static', 'Ночью — поднятый фонарь с белым огнём')
  ),
  'auxiliary-p60-release': define(
    'auxiliary-p60-release',
    'Отпустить тормоза',
    pose('hand', 'horizontal', 'horizontal', 'Днём — движения руки по горизонтали'),
    pose('lantern_white', 'horizontal', 'horizontal', 'Ночью — движения фонаря по горизонтали')
  ),
  'auxiliary-p66-trackwalker': define(
    'auxiliary-p66-trackwalker',
    'Встреча обходчиком',
    pose('yellow_flag_closed', 'raised', 'static', 'Днём — свёрнутый жёлтый флаг'),
    pose('lantern_white', 'raised', 'static', 'Ночью — прозрачно-белый огонь фонаря')
  ),
};

export function getHandSignalVisual(itemId: string): HandSignalVisualDefinition | undefined {
  return handSignalVisuals[itemId];
}

export function hasHandSignalVisual(itemId: string): boolean {
  return itemId in handSignalVisuals;
}
