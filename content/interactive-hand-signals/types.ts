export type HandSignalProp =
  | 'red_flag'
  | 'yellow_flag_open'
  | 'yellow_flag_closed'
  | 'white_disc'
  | 'hand'
  | 'lantern_red'
  | 'lantern_yellow'
  | 'lantern_green'
  | 'lantern_white';

export type HandSignalArm = 'raised' | 'lowered' | 'horizontal';

export type HandSignalMotion = 'static' | 'circle' | 'vertical' | 'horizontal';

export interface HandSignalPose {
  prop: HandSignalProp;
  arm: HandSignalArm;
  motion: HandSignalMotion;
  caption_ru: string;
}

export interface HandSignalVisualDefinition {
  itemId: string;
  gestureLabel_ru: string;
  day: HandSignalPose;
  night: HandSignalPose;
}
