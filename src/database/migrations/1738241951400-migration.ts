import { MigrationInterface, QueryRunner } from 'typeorm';
import { AssetTypes } from '../../assets/types/asset.types';
import { globalSymbols } from '../../rate/consts/symbols.const';
import { Asset } from '../../assets/entities/asset.entity';

export class Migration1738241951400 implements MigrationInterface {
  name = 'Migration1738241951400';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "paypilot"."assets_type_enum" AS ENUM('FIAT', 'CRYPTO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "paypilot"."assets" ("id" SERIAL NOT NULL, "symbol" character varying NOT NULL, "name" character varying NOT NULL, "type" "paypilot"."assets_type_enum", CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9b4bd5b9c6fe49cd3b4342fb91" ON "paypilot"."assets" ("symbol") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_013e7b742fb1b5b2e6602446d8" ON "paypilot"."assets" ("name") `,
    );
    const repo = queryRunner.manager.getRepository(Asset);
    const crypto: Omit<Asset, 'id'>[] = Object.entries(
      globalSymbols.coingecko,
    ).map(([a, b]) => {
      return { symbol: b, name: a, type: AssetTypes.CRYPTO };
    });
    const fiat: Omit<Asset, 'id'>[] = [
      {
        symbol: 'AED',
        name: 'AED',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'ARS',
        name: 'ARS',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'AUD',
        name: 'AUD',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'AZN',
        name: 'AZN',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'BGN',
        name: 'BGN',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'BHD',
        name: 'BHD',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'BRL',
        name: 'BRL',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'CAD',
        name: 'CAD',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'CHF',
        name: 'CHF',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'CLP',
        name: 'CLP',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'COP',
        name: 'COP',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'CRC',
        name: 'CRC',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'CZK',
        name: 'CZK',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'DKK',
        name: 'DKK',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'DOP',
        name: 'DOP',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'EUR',
        name: 'EUR',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'GBP',
        name: 'GBP',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'GEL',
        name: 'GEL',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'GTQ',
        name: 'GTQ',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'HKD',
        name: 'HKD',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'HNL',
        name: 'HNL',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'HRK',
        name: 'HRK',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'HUF',
        name: 'HUF',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'IDR',
        name: 'IDR',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'ILS',
        name: 'ILS',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'INR',
        name: 'INR',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'JPY',
        name: 'JPY',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'KRW',
        name: 'KRW',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'KWD',
        name: 'KWD',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'MDL',
        name: 'MDL',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'MXN',
        name: 'MXN',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'MYR',
        name: 'MYR',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'NOK',
        name: 'NOK',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'NZD',
        name: 'NZD',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'OMR',
        name: 'OMR',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'PEN',
        name: 'PEN',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'PHP',
        name: 'PHP',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'PLN',
        name: 'PLN',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'PYG',
        name: 'PYG',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'QAR',
        name: 'QAR',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'RON',
        name: 'RON',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'RWF',
        name: 'RWF',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'SAR',
        name: 'SAR',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'SEK',
        name: 'SEK',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'THB',
        name: 'THB',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'TRY',
        name: 'TRY',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'TWD',
        name: 'TWD',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'USD',
        name: 'USD',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'UYU',
        name: 'UYU',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'VND',
        name: 'VND',
        type: AssetTypes.FIAT,
      },
      {
        symbol: 'ZAR',
        name: 'ZAR',
        type: AssetTypes.FIAT,
      },
    ];
    await repo.save([...crypto, ...fiat]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "paypilot"."IDX_013e7b742fb1b5b2e6602446d8"`,
    );
    await queryRunner.query(
      `DROP INDEX "paypilot"."IDX_9b4bd5b9c6fe49cd3b4342fb91"`,
    );
    await queryRunner.query(`DROP TABLE "paypilot"."assets"`);
    await queryRunner.query(`DROP TYPE "paypilot"."assets_type_enum"`);
  }
}
