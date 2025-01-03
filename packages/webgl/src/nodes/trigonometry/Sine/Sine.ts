import { Output } from '@bitspace/circuit';
import { sin } from '@thi.ng/shader-ast';
import { map } from 'rxjs';

import { PrimSchema } from '../../../schemas/Prim/Prim';
import { InputPrimNode } from '../../internal/InputPrimNode/InputPrimNode';

export class Sine extends InputPrimNode {
    static displayName = 'Sine';

    outputs = {
        output: new Output({
            name: 'Output',
            type: PrimSchema(),
            observable: this.inputs.input.pipe(map(sin))
        })
    };
}
