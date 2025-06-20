import type { ConvertParams, Result } from '../../types';
export default function convert({ animations: animationsFromProps, currentAnimation, fileName: fileNameFromProps, generator, isDotLottie, manifest, shouldDownload, src, typeCheck }: ConvertParams): Promise<Result>;
